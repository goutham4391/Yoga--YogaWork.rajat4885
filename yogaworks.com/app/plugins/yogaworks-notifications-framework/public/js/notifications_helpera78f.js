
// our js package
ywah_notifications_helper = {

	// our ajax api actions
	ywah_load_user_notifications: function(callback) {
		return ywah_notifications_helper.ywah_ajax_action('ywah__push_notifications__get_user_notifications', {}, callback);
	},
	ywah_delete_user_notification: function(id, callback) {
		return ywah_notifications_helper.ywah_ajax_action('ywah__push_notifications__delete_user_notification', { id: id }, callback);
	},
	// utility function for calling the ajax gateway
	ywah_ajax_action: function(action, data, callback) {
		//console.log("[ywah] " + action + " -> ", data);
		data.action = action;
		data.nonce = helper_gateway.nonce;
		return $.ajax({
			type : "post",
			dataType : "json",
			url : helper_gateway.ajax_url,
			data : data,
			success: function(res) {
				//console.log("[ywah]   " + action + " <- ", res);
				return callback(res);
			},
		});
	},

	// used to force initial load of the notifications widget
	reload_notifications_list_widgets: function () {
		$('.ywah-notifications-list-widget').each(function () {
			var widget = $(this);
			ywah_notifications_helper.do_load_user_notifications(widget);
		});
	},
	// this reloads a single notifications widget
	do_load_user_notifications: function (widget) {
		// first load the notifications
		ywah_notifications_helper.ywah_load_user_notifications(function(res) {
			// check success
			if (!res.success) {
				// console.log("error occured getting notifications: ", res);
				return;
			}

			// render the widget
			widget.html(res.data.html);

			// add some special js logic
			ywah_notifications_helper.render_user_notifications_again(widget);

			// hook up the buttons of the widget
			widget.find('.ywah-notification-delete-button').each(function () {
				var button = $(this);
				// if the delete button is pressed, delete this notification
				button.on('click', function() {
					// get our arguments from the button
					var id = button.data('id');
					ywah_notifications_helper.ywah_delete_user_notification(id, function(res) {
						// if we succeeded, reload the widget's list of notifications
						if (res.success) {
							button.parent().remove();
							ywah_notifications_helper.render_user_notifications_again(widget);
						}
					});
				});
			});
		});
	},

	render_user_notifications_again: function (widget) {
		var max_notifications = widget.data('max-notifications');

		widget.find('.ywah-user-notification').each(function (i) {
			if (i < max_notifications) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	},
};



$(() => {
	ywah_notifications_helper.reload_notifications_list_widgets();
	$('.ywah-settings-notification-delete-button').on('click', function (e) {
		e.preventDefault();
		e.stopPropagation();

		var button = $(this);
		ywah_notifications_helper.ywah_delete_user_notification(button.data('id'), function(res) {
			var column_container = button.parent().parent().parent();
			button.parent().parent().remove();
			console.log("debug column_container:", column_container.children());
			if (column_container.children().length < 1) {
				column_container.parent().parent().remove();
			}
		});
	});
});



