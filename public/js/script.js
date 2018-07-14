'use strict';
window.addEventListener('load', () => {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.getElementsByClassName('needs-validation');
	// Loop over them and prevent submission
	const validation = Array.prototype.filter.call(forms, form => {
		form.addEventListener('submit', event => {
			event.preventDefault();
			event.stopPropagation();

			if (form.checkValidity() === false) {
				console.log('invalid');
			} else {
				console.log('valid');
				postForm();
			}
			form.classList.add('was-validated');
		}, false);
	});
}, false);

function postForm() {
	let jqxhr = $.post("/survey", $( "#survey" ).serialize())
		.done(function () {
			$("error-container").hide();
			$("#survey-container").slideUp(200, () => {
				$("#thanks-container").slideDown(200);
			});
		})
		.fail(function (e) {
			console.log('fail', e);
			$("error-container").show();
		});
}