var tfaInterval = null,
	onSubscribeSubmit = function (token) {
	// console.log("submitted: " + token);

	$('[data-form-validate]')['form-validate']('onSubmitEvents', token);
};

ywah_onboarding_helper = {
    push_gtm_registration_event: function (userData, isBegin) {
        var status = isBegin ? 'begin' : 'completed',
            dataLayer = window.dataLayer || [];

        dataLayer.push({
            'event': 'begin_registration',
            'registrationStatus': status,
        });
    },
	submit_onboarding_start: function (form) {
		var $requestBtn = $('[data-btn-tfa-request-again]');
		clearInterval(tfaInterval);
		$requestBtn.prop('disabled', true);
		ywah_onboarding_helper.ywah_ajax_action_w_loader('ywah__onboarding__start_submission',
				ywah_onboarding_helper.get_form_data($(form)),
				res => {
			if (res.success) {
				/*if optimum fitness user; skip checkout*/
				if (res.data.is_optimum_fitness) {
					var params = decodeURIComponent($.cookie('is_optimum_fitness'));

					window.location.href = '/' + params;
					return false;
				}

				var submission_callback = function () {
                    ywah_onboarding_helper.push_gtm_registration_event(res.data, true);

					$('.onboarding-start').hide();
					if (typeof res.data.offerId !== 'undefined' && res.data.offerId) {
						if (typeof pianoObject.isCheckoutInline !== 'undefined' && pianoObject.isCheckoutInline) {
							pianoObject.isSubscribePage = true;
							$('body').addClass('piano-checkout-inline');
						}
						var offerId = res.data.offerId,
							tplId = res.data.tplId,
							redirectUrl = $(form).data('onboarding-redirect'),
							offerOptions = {
								displayMode: "inline",
								containerSelector: "#piano-subscribe",
								offerId: offerId,
								complete: function (params) {
									params.action = 'yahp__checkout_complete';
									params.hasAscendCookie = res.data.hasAscendCookie;
									$.ajax({
										type: "post",
										dataType: "json",
										url: helper_gateway.ajax_url,
										data: params,
										success: function () {
											window.location = redirectUrl;
										},
									});
								},
							};

						redirectUrl = redirectUrl + (redirectUrl.indexOf('?') >= 0 ? '&' : '?') + '_newuser=1';
						if (tplId) {
							offerOptions.templateId = tplId;
						}

						if (offerId) {
							$('.piano-subscribe-wrapper').show();
							tp.push(["init", function () {
								tp.offer.show(offerOptions);
							}]);
						} else {
							window.location = redirectUrl;
						}
					} else if (typeof res.data.testCase !== 'undefined' && parseInt(res.data.testCase) === 4) {
						$('.onboarding-preferences').show().find('form input[name="email"]').val(res.data.email);
						$('[data-onboarding-header-menu-start]').removeClass('disabled active').addClass('completed');
						$('[data-onboarding-header-menu-preferences]').removeClass('disabled').addClass('active');
						$('[data-onboarding-pref-replace-first-name]').text(res.data.firstName);
						$('[data-onboarding-pref-replace-last-name]').text(res.data.lastName);
						helper_gateway.nonce = res.data.newNonce;

                        // User created, but not checkout anything
                        ywah_onboarding_helper.push_gtm_registration_event(res.data, false);
					} else {
						var $newSubscribePlan = $('.onboarding-checkout-plan-list');
						if ($newSubscribePlan.length) {
							helper_gateway.isNewSubscribeFlow = true;
							$newSubscribePlan.show();
						} else {
							$('.onboarding-checkout').show();
						}
					}
				};

				if (typeof res.data.enableTfa !== 'undefined' && parseInt(res.data.enableTfa) === 1) {
					$('#tfaOnboardingConfirm').modal('show');
					$('#tfaOnboardingConfirm [data-phone-number]').html(res.data.phoneNum);
					$('#tfaOnboardingConfirm input[name="phone_number"]').val(res.data.phoneNum);
					helper_gateway.tfaCallback = submission_callback;

					if (typeof res.data.newNonce !== 'undefined') {
						helper_gateway.nonce = res.data.newNonce;
					}

					$requestBtn.parent().append('<span class="countdown" data-tfa-countdown>Resend code in <span>00:60</span></span>');
					$requestBtn.hide();

					var time = 60;

					tfaInterval = setInterval(function () {
							time--;
							$('[data-tfa-countdown] span').html('00:' + (time < 10 ? '0' + time : time));
							if (time === 0) {
								clearInterval(tfaInterval);
								$('[data-tfa-countdown]').remove();
								$requestBtn.show().prop('disabled', false);
							}
						}, 1000);
				} else {
					submission_callback();
				}
			} else {
        if(res.data.error == 'optimum'){
          switch(res.data.reason){
            case 'no_user':
              $('.opt-m-title').html('Unfortunately, this account is not exist.');
              $('.opt-m-subtitle').html(res.data.message);
              $('.modal-footer-text').html('');
              break;
            case 'expiried':
              $('.opt-m-title').html('Unfortunately, your account has expired.');
              $('.opt-m-subtitle').html(res.data.message);
              $('.modal-footer-text').html('');
              break;
          }
          $('.renew-active-reject-popup').show();
          return false;
        }

				if (res.data.error === 'email_in_use') {
					$(form).validate().showErrors({ email: res.data.message });
				} else if (res.data.error === 'optimum_in_use') {
          $(form).validate().showErrors({ optimum_code: res.data.message });
          return false;
        } else {
					$(form).find('.general-error').text(res.data.message || res.data[0].message).show();
				}
			}
		});
	},
	submit_onboarding_checkout: function (form, callback) {
		ywah_onboarding_helper.ywah_ajax_action_w_loader('ywah__onboarding__checkout_submission',
			ywah_onboarding_helper.get_form_data($(form)),
			res => {
				if (typeof callback === 'function') {
					callback();
				}

				if (res.success) {
                    // Complete
                    ywah_onboarding_helper.push_gtm_registration_event(res.data, false);

					var cookieExpires = 5 / (24 * 60),
						redirectUrl = $(form).data('onboarding-redirect');

					redirectUrl = redirectUrl + (redirectUrl.indexOf('?') >= 0 ? '&' : '?') + '_newuser=1';

					$.cookie('_yah_event_id', res.data.eventId, {expires: cookieExpires, path: '/'});
					$.cookie('_yah_recurly_plan_code', res.data.planCode, {expires: cookieExpires, path: '/'});
					$.cookie('_yah_subscription_price', (res.data.planPrice === null || isNaN(res.data.planPrice)) ? null : res.data.planPrice.toFixed(2), {
						expires: cookieExpires,
						path: '/'
					});
					$.cookie('_yah_recurly_member_id', res.data.recurlyMemberId, {expires: cookieExpires, path: '/'});
					$.cookie('_yah_recurly_coupon_code', res.data.couponCode, {expires: cookieExpires, path: '/'});
					$.cookie('_yah_recurly_amount', res.data.amountSum, {expires: cookieExpires, path: '/'});

					window.location = redirectUrl;
				} else {
					if (res.data.error === 'email_in_use') {
						$(form).validate().showErrors({email: res.data.message});
					} else {
						$(form).find('.general-error').text(res.data.message || res.data[0].message).show();

						var isApplePay = $('[data-apple-pay-wrap]').hasClass('apple-pay-supported');
						if (typeof isApplePay !== 'undefined' && isApplePay) {
							$(form).find('.cc-form-inputs').show();
							$(form).find('.intl-payment-wrap').show();
							$('[data-apple-pay-wrap] .apple-pay-button').removeClass('apple-pay-button-hidden');
						}
					}
				}
			}
		);
	},
	submit_onboarding_gift_code: function (form, successCallback, failCallback) {
		ywah_onboarding_helper.ywah_ajax_action('ywah__onboarding__checkout_validate_promo',
			ywah_onboarding_helper.get_form_data($(form)),
			res => {
				if (res.success) {
					successCallback(res.data);
					if (typeof recurlyData.previewPurchase === 'function') {
						recurlyData.previewPurchase();
					}
				} else {
					$(form).validate().showErrors({gift_code: res.data.message || res.data[0].message});
					failCallback();
				}
			}
		);
	},
	submit_onboarding_redeem_gift_card_code: function (form, successCallback, failCallback) {
		ywah_onboarding_helper.ywah_ajax_action('validate_gift_card',
			ywah_onboarding_helper.get_form_data($(form)),
			res => {
				if (res.success) {
					successCallback(res.data);
				} else {
					$(form).validate().showErrors({gift_code: res.data.message || res.data[0].message});
					failCallback();
				}
			}
		);
	},
	submit_onboarding_tfa_verify: function (form) {
		$(form).find('[data-btn-tfa-confirm]').prop("disabled", true);
		ywah_onboarding_helper.ywah_ajax_action('yw_tfa_verify_code',
			ywah_onboarding_helper.get_form_data($(form)),
			res => {
				$(form).find('[data-btn-tfa-confirm]').prop("disabled", false);
				if (res.success) {
					if (typeof helper_gateway.tfaCallback === 'function') {
						helper_gateway.tfaCallback();
						$('#tfaOnboardingConfirm').modal('hide');
						$('input[name="trust_device"]').val($('input[name="trust-device"]').is(':checked') ? 1 : '');
					} else if (parseInt($(form).find('[data-btn-tfa-confirm]').data('is-header')) === 1) {
						$('#ywTfaModal').modal('hide');
						location.reload();
					}
				} else {
					$(form).validate().showErrors({otp_code: res.data.message || res.data[0].message});
				}
			}
		);
	},
	submit_onboarding_tfa_request: function (form) {
		var $requestBtn = $(form).find('[data-btn-tfa-request-again]');
		$requestBtn.prop('disabled', true);
		$(form).find('.general-error').text('');
		ywah_onboarding_helper.ywah_ajax_action('yw_tfa_request_code',
			{phone_number: $(form).find('input[name="phone_number"]').val()},
			res => {
				if (res.success) {
					$requestBtn.parent().append('<span class="countdown" data-tfa-countdown>Resend code in <span>00:60</span></span>');
					$requestBtn.hide();
					var time = 60,
						interval = setInterval(function () {
							time--;
							$('[data-tfa-countdown] span').html('00:' + (time < 10 ? '0' + time : time));
							if (time === 0) {
								clearInterval(interval);
								$('[data-tfa-countdown]').remove();
								$requestBtn.show().prop('disabled', false);
							}
						}, 1000);
				} else {
					$(form).find('.general-error').text(res.data.message || res.data[0].message).show();
					$requestBtn.show().prop('disabled', false);
				}
			}
		);
	},
	submit_onboarding_process_step: function (form, data, callback) {
		var $form = $(form),
			$nextStep = $form.find('[data-next-step]'),
			$skipStep = $form.find('[data-skip-step]');

		$nextStep.addClass('disabled').prop('disabled', true);
		$skipStep.addClass('disabled').prop('disabled', true);
		ywah_onboarding_helper.ywah_ajax_action('ywah__onboarding__process_step', data,
			res => {
				if (res.success) {
					if (typeof res.data.testCase !== 'undefined' && parseInt(res.data.testCase) === 4) {
						$('[data-onboarding-header-menu-preferences]').removeClass('disabled active').addClass('completed');
						$('[data-onboarding-header-menu-praticle]').removeClass('disabled').addClass('active');

						$('.onboarding-preferences').hide();
						$('.onboarding-checkout').show();
					} else {
						callback();
					}
				} else {
					$(form).find('.general-error').text(res.data.message || res.data[0].message).show();
					$nextStep.removeClass('disabled').prop('disabled', false);
					$skipStep.removeClass('disabled').prop('disabled', false);
				}
			}
		);
	},
	// utility function for calling the ajax gateway
	ywah_ajax_action: function(action, data, callback) {
		// console.log("[ywah][onboarding_helper] " + action + " -> ", data);
		data.action = action;
		data.nonce = helper_gateway.nonce;
		return $.ajax({
			type : "post",
			dataType : "json",
			url : helper_gateway.ajax_url,
			data : data,
			success: function(res) {
				// console.log("[ywah][onboarding_helper]   " + action + " <- ", res);
				return callback(res);
			},
		});
	},
	ywah_ajax_action_w_loader: function (action, data, callback) {
		data.action = action;
		data.nonce = helper_gateway.nonce;

		$.fn.callAjaxGlobal({
			url: helper_gateway.ajax_url,
			method: 'POST',
			cache: false,
			loader: true,
			data: data,
		}).done(function (res) {
			return callback(res);
		}).fail(function (request, status, error) {
		});
	},
	get_form_data: function(form) {
		return form.serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
	}
};
