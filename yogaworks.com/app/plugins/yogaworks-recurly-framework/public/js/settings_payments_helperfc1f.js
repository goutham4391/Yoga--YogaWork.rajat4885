var onCheckoutSubmit = function (token) {
  $('[data-form-validate]')['form-validate']('onSubmitEvents', token);
};

ywah_settings_payments_helper = {
	// ajax call to submit a lazy load for settings-payments tab
	lazy_load_settings_payments: function (callback) {
		ywah_settings_payments_helper.ywah_ajax_action('ywah__settings_payments__lazy_load_tab',
				{},
				res => {
			if (res.success) {
				callback(res.data.html);
			} else {
				// console.log(res.message || res.data[0].message);
			}
		});
	},
	// ajax call to submit a change payment
	submit_settings_payment_method: function (form) {
		$(form).find('button').prop("disabled", true);
		ywah_settings_payments_helper.ywah_ajax_action('ywah__settings_payments__change_payment_method',
				ywah_settings_payments_helper.get_form_data($(form)),
				res => {
			$(form).find('button').prop("disabled", false);
			if (res.success) {
				$('#updatePaymentCard').modal('hide');
				$('[data-target="#updatePaymentCard"]').text(res.swap_message);
			} else {
				// jquery-validate likes to delete our error message, so we optionally add it back in here
				if ($(form).find('.general-error').length === 0)
					$(form).find('.modal-footer').prepend($('<label class="error validate-error general-error"></label>'));
				// set the general error message
				$(form).find('.general-error').text(res.message || res.data.message).show();
			}
		});
	},
	// ajax call to submit a redeem code
	submit_settings_redeem_code: function (form) {
		$(form).find('button').prop("disabled", true);
		ywah_settings_payments_helper.ywah_ajax_action('ywah__settings_payments__redeem_code',
				ywah_settings_payments_helper.get_form_data($(form)),
				res => {
			$(form).find('button').prop("disabled", false);
			if (res.success) {
				$('#couponCode').modal('hide');
				location.reload();
			} else {
				if (typeof res.data.openCheckoutForm !== 'undefined' && res.data.openCheckoutForm) {
					$('#couponCode').modal('hide');
					$('body').addClass('modal-open').append('<a id="redeem-code-open-checkout" href="#" data-toggle="modal" ' +
							'data-target="#accountPlanManagement" data-plan-type="' + res.data.planType + '" data-checkout-only="true" ' +
							'data-plan-code="' + res.data.planCode + '" data-promo-code="' + res.data.promoCode + '">Checkout</a>');
					$('#redeem-code-open-checkout').trigger('click');
				} else {
					// jquery-validate likes to delete our error message, so we optionally add it back in here
					if ($(form).find('.general-error').length === 0)
						$(form).find('.modal-footer').prepend($('<label class="error validate-error general-error"></label>'));

					// set the general error message
					$(form).find('.general-error').text(res.data.message).show();
				}
			}
		});
	},
	submit_settings_redeem_gift_card_code: function (form) {
		$(form).find('button').prop("disabled", true);
		ywah_settings_payments_helper.ywah_ajax_action('gift_card_redeem',
			ywah_settings_payments_helper.get_form_data($(form)),
			res => {
				$(form).find('button').prop('disabled', false);
				if (res.success) {
					$('#redeemGiftCard').modal('hide');
					location.reload();
				} else {
					$(form).find('.general-error').text(res.data.message).show();
				}
			});
	},
	// ajax call to submit an update plan
	submit_update_plan: function (form) {
		$(form).find('button').prop("disabled", true);
		ywah_settings_payments_helper.ywah_ajax_action('ywah__settings_payments__update_plan',
				ywah_settings_payments_helper.get_form_data($(form)),
				res => {
			$(form).find('button').prop("disabled", false);
			if (res.success) {
				$('#subscriptionPlan').modal('hide');
				ywah_settings_payments_helper.populate_subscriptions_container(res.subscriptions_data);
			} else {
				// jquery-validate likes to delete our error message, so we optionally add it back in here
				if ($(form).find('.general-error').length === 0)
					$(form).find('.modal-footer').prepend($('<label class="error validate-error general-error"></label>'));
				// set the general error message
				$(form).find('.general-error').text((res.message || res.data.message || res.data.message)).show();
			}
		});
	},
	// ajax call to submit a add-onetime-plan
	submit_add_onetime_plan: function (form) {
		$(form).find('button').prop("disabled", true);
		ywah_settings_payments_helper.ywah_ajax_action('ywah__settings_payments__add_onetime_plan',
				ywah_settings_payments_helper.get_form_data($(form)),
				res => {
			$(form).find('button').prop("disabled", false);
			if (res.success) {
				$('#onetimeSubscriptionPlan')
					.modal('hide')
					.find('.plan-detail').addClass('d-none');
				ywah_settings_payments_helper.populate_subscriptions_container(res.subscriptions_data);
			} else {
				// jquery-validate likes to delete our error message, so we optionally add it back in here
				if ($(form).find('.general-error').length === 0)
					$(form).find('.modal-footer').prepend($('<label class="error validate-error general-error"></label>'));
				// set the general error message
				$(form).find('.general-error').text((res.message || res.data.message || res.data.message) + " Please contact support to resolve this issue.").show();
			}
		});
	},
	// utility function for calling the ajax gateway
	ywah_ajax_action: function(action, data, callback) {
		//console.log("[ywah][settings_payments_helper] " + action + " -> ", data);
		data.action = action;
		data.nonce = settings_payments_helper_gateway.nonce;

		return $.fn.callAjaxGlobal({
			url: settings_payments_helper_gateway.ajax_url,
			method: 'post',
			data: data,
			dataType: 'json',
			cache: false,
			loader: true
		}).done(function (res) {
			//console.log("[ywah][settings_payments_helper]   " + action + " <- ", res);
			return callback(res);
		}).fail(function (request, status, error) {
			return callback({success: false, message: 'Request failed.'});
		});
	},
	// utlity function for getting form data as a neat object
	get_form_data: function(form) {
		// transform our form data array to a proper object
		return form.serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
	},
	// fills out the fields of the subscription-plan modal based on the id of the subscription clicked
	populate_subscription_modal: function(id, code) {
		var modal = $('.modal-recurring-subscription'),
			$codeInput = modal.find('input[value="' + code + '"]');
		// set our hidden subscription id value
		modal.find('input[name="subscription_id"]').val(id);
		// pre-select the currently targetted subscription plan
		modal.find('input[type="radio"]').prop("checked", undefined);

		$codeInput.attr('data-subs-id', id);
		$codeInput.click().closest('.title-wrap').find('.plan-detail').removeClass('d-none');

		// hide all "- current" subscription labels
		modal.find('.current-subscription-label').hide();
		// if we have an id, show that subscription as the currently selected one
		if (id !== '') {
			modal.find('input[value="' + code + '"] + span + span .current-subscription-label').show();

			// also move the "- current" entry to the top
			var target_input = modal.find('input[value="' + code + '"]').first()[0];
			modal.find('.modal-body').prepend(
				modal.find('.subscription-plan-form-group').filter(function () {
					return $.contains(this, target_input);
				}));
		}
	},
	// fills out the subscription groups on the page based on the subscriptions data returned from the server
	// see SettingsPaymentsManager for details on the data format
	populate_subscriptions_container: function(subscriptions_data) {
		var container = $('.subscription-groups-container');

		// delete all subscription group entries that are filled out and are not a template
		container
			.find('.recurring-subscription-group, .onetime-subscription-group')
			.not('.subscription-group-template, .subscription-group-reactivate-template')
			.remove();

		// only show the 'add a recurring subscription group' if we have no active or expired subscriptions to show
		if (subscriptions_data.active_recurring_subscriptions.length === 0 && !subscriptions_data.last_expired_subscription)
			container.find('.add-recurring-subscription-group').show();
		else
			container.find('.add-recurring-subscription-group').hide();

		// populate the list of active recurring subscriptions
		for (var sub of subscriptions_data.active_recurring_subscriptions)
			ywah_settings_payments_helper.populate_subscription_group_template(
				container.find('.recurring-subscription-group.subscription-group-template'), sub)
					.insertBefore(container.find('.add-recurring-subscription-group'));

		// if there are no active recurring subscriptions, try to show the last expired
		if (subscriptions_data.active_recurring_subscriptions.length === 0 && subscriptions_data.last_expired_subscription)
			ywah_settings_payments_helper.populate_subscription_group_template(
				container.find('.recurring-subscription-group.subscription-group-reactivate-template'), subscriptions_data.last_expired_subscription)
					.insertBefore(container.find('.add-recurring-subscription-group'));

		// populate the list of active recurring subscriptions
		for (var sub of subscriptions_data.active_onetime_subscriptions)
			ywah_settings_payments_helper.populate_subscription_group_template(
				container.find('.onetime-subscription-group.subscription-group-template'), sub)
					.insertBefore(container.find('.add-onetime-subscription-group'));


		$('.transaction-list-container')
			.children()
			.not('.transaction-entry-template')
			.remove();

		for (var transaction of subscriptions_data.transactions)
			$('.transaction-list-container').append(ywah_settings_payments_helper.populate_transaction_entry_template(
				$('.transaction-list-container .transaction-entry-template'),
				transaction));


	},
	// clones a template of 'subscription-group' and populates labels and data variables
	populate_subscription_group_template: function (template, sub) {
		var dom = template.clone();
		// remove template indicator
		dom.removeClass('subscription-group-template');
		dom.removeClass('subscription-group-reactivate-template');
		// populate our fields
		dom.find('a:contains("{name}")').text(sub.name);
		dom.find('p:contains("{description}")').text(sub.description);
		dom.find('[data-subscription-id]').attr('data-subscription-id', sub.subscription_id);
		dom.find('[data-subscription-id]').attr('data-subscription-expired', sub.subscription_expired);
		dom.find('[data-subscription-code]').attr('data-subscription-code', sub.subscription_code);
		// diable display:none
		dom.show();
		// return dom to insert it somewhere
		return dom;
	},
	// clones a template of 'subscription-group' and populates labels and data variables
	populate_transaction_entry_template: function (template, transaction) {
		var dom = template.clone();
		// remove template indicator
		dom.removeClass('transaction-entry-template');
		// populate our fields
		dom.find('p:contains("{title}")').text(transaction.title);
		// diable display:none
		dom.show();
		// return dom to insert it somewhere
		return dom;
	},
	submit_setting_tfa_request: function (form) {
		$(form).find('button').prop('disabled', true);
		$(form).find('.general-error').text('');
		ywah_settings_payments_helper.ywah_ajax_action('yw_tfa_request_code',
			{
				phone_country_code: $(form).find('input[name="phone_country_code"]').val(),
				phone_number: $(form).find('input[name="phone_number"]').val(),
			},
			res => {
				$(form).find('button').prop('disabled', false);
				if (res.success) {
					$('#tfaPhoneNumber').modal('hide');
					$('#tfaVerifyForm').modal({
						backdrop: 'static',
						keyboard: false
					}, 'show');
					$('#tfaVerifyForm input[name="phone_number"]').val(res.data.phone_number);
					$('#tfaVerifyForm [data-phone-number]').html(res.data.phone_number);
					$('[data-btn-tfa-settings-request-again]').html('Request Again').prop('disabled', false);
				} else {
					$(form).find('.general-error').text(res.data.message || res.data[0].message).show();
				}
			}
		);
	},
	submit_setting_tfa_request_again: function (form) {
		var $requestBtn = $(form).find('[data-btn-tfa-settings-request-again]');
		$requestBtn.prop('disabled', true);
		$(form).find('.general-error').text('');
		ywah_settings_payments_helper.ywah_ajax_action('yw_tfa_request_code',
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
	submit_setting_tfa_verify: function (form) {
		$(form).find('[data-btn-tfa-settings-confirm]').prop("disabled", true);
		ywah_settings_payments_helper.ywah_ajax_action('yw_tfa_verify_code',
			ywah_settings_payments_helper.get_form_data($(form)),
			res => {
				$(form).find('[data-btn-tfa-settings-confirm]').prop("disabled", false);
				if (res.success) {
					$('#tfaVerifyForm').modal('hide');
					location.reload();
				} else {
					$(form).validate().showErrors({otp_code: res.data.message || res.data[0].message});
				}
			}
		);
	},
};

$(function () {
  var $body = $('body');

	// perform lazy loading of the settings-payments tab when we find this container
	$('[data-lazy-load-settings-payments]').each(function () {
		var loader_tab = $(this);
		// call ajax
		ywah_settings_payments_helper.lazy_load_settings_payments(html => {
			// create the dom and replace the container
			var dom = $(html);
			loader_tab.replaceWith(dom);
			// re-select the container so that our tabbulation isn't broken
			if ($('#payments-tab.nav-link.active').length > 0) {
				$('#profile-tab.nav-link').click();
				$('#payments-tab.nav-link').click();
			}
			// enable form-validate plugin on the dom
			dom.find('[data-form-validate]')['form-validate']();
			// enable plan-details button
			// dom.find('[data-subscription-plan]')['subscription-plan']();
			dom['subscription-plan']();
			// enable mask properties on forms GAHHHHHHHHH
			dom.find('[data-mask]').each(function () {
				$(this).mask($(this).data('mask'));
			});
		});
	});

	// hook the events of clicking on data-subscription groups
	// note that toggling the modal is done by bootstrap, not this code
  $body
		.off('click', '[data-subscription-code]')
		.on('click', '[data-subscription-code]', function () {
			var link = $(this);
			// only send subscription_id if the subscription is not expired
			var subscription_id = !link.data('subscription-expired') ? link.data('subscription-id') : '';
			var subscription_code = link.data('subscription-code');
			ywah_settings_payments_helper.populate_subscription_modal(subscription_id, subscription_code);
		});

  $body
		.off('click', '[data-subscription-add]')
		.on('click', '[data-subscription-add]', function () {
			var link = $(this);
			// no subscription id to send
			var subscription_id = '';
			var subscription_code = '';
			ywah_settings_payments_helper.populate_subscription_modal(subscription_id, subscription_code);
		});

  $body
		.off('click', '[data-reactivate-subscription-btn]')
		.on('click', '[data-reactivate-subscription-btn]', function (e) {
			e.preventDefault();

			var $that = $(this);

			$that.prop('disabled', true);

			ywah_settings_payments_helper.ywah_ajax_action('yah__reactivate_plan',
				{
					subscription_id: $that.data('subscription-id'),
				},
				res => {
					$that.prop('disabled', false);

					if (res.success) {
            location.reload();
					} else {
					}
				});
		});

	$('[data-2fa-switch-btn]').off('click').on('click', function () {
		var $that = $(this),
			$error = $('[data-tfa-switch-error]');
		$that.prop('disabled', true);
		$error.html('').hide();
		ywah_settings_payments_helper.ywah_ajax_action('yw_tfa_update', {}, res => {
			$that.prop('disabled', false);
			if (res.success) {
				if (typeof res.data.showVerifyPopup !== 'undefined' && parseInt(res.data.showVerifyPopup) === 1) {
					$('#tfaVerifyForm').modal('show');
					$('#tfaVerifyForm input[name="phone_number"]').val(res.data.phoneNumber);
					$('#tfaVerifyForm input[name="tfa_status"]').val(res.data.tfaStatus);
					$('#tfaVerifyForm [data-phone-number]').html(res.data.phoneNumber);
					$('[data-btn-tfa-settings-request-again]').html('Request Again').prop('disabled', false);
				} else {
					$('#tfaPhoneNumber').modal('show');
					$('#tfaPhoneNumber [data-form-validate]')['form-validate']();
				}
			} else {
				$error.html(res.data.message).show();
			}
		});
	});
});


