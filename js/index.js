$(document).ready(function() {
	var workTime = {
		'seconds': 0,
		'minutes': 0,
		'hours': 0
	};
	var breakTime = {
		'seconds': 0,
		'minutes': 0,
		'hours': 0
	};
	var timeInterval;
	var end = true;
	var startWork;
	var endWork;
	var workSession = {
		'count': 0,
		'time': workTime,
		'reset': '0',
		'input': $('#workInput'),
		'outter': $('.outter-work'),
		'clock': $('#clock1 > .time')
	};
	var breakSession = {
		'count': 0,
		'time': breakTime,
		'reset': '0',
		'input': $('#breakInput'),
		'outter': $('.outter-break'),
		'clock': $('#clock2 > .time')
	};
	var session = workSession;

	function rotateDial() {
		$(this).siblings('.outter').css('transform', 'rotate(' + ($(this).text() * 6) + 'deg)');
		if ($(this).siblings('.outter').hasClass('outter-break')) {
			breakSession.count = $(this).text() * 6;
			breakSession.input.val(breakSession.count / 6);
		} else {
			workSession.count= $(this).text() * 6;
			workSession.input.val(workSession.count / 6);
		}
	}

	function out(objt) {
		objt.count += 6;
		objt.outter.css('transform', 'rotate(' + objt.count + 'deg)');
		objt.input.val(objt.count / 6);
	}

	function reset(objt) {
		objt.input.val('0');
		objt.input.css('background-color', '#CCC');
		objt.input.prop('disabled', false);
		objt.outter.off('click');
		objt.outter.on('click', function() {
			out(objt);
		});
		end = true;
		$('.time').on('click', rotateDial);		
	}

	breakSession.outter.on('click', function() {
		out(breakSession);
	});
												

	workSession.outter.on('click', function() {
		out(workSession);
	});

	$('.time').on('click', rotateDial);

	$("#workForm").submit(function(e) {
		e.preventDefault();
		var x = workSession.input.val();
		if (Math.floor(x) == x && $.isNumeric(x)) {
			workSession.outter.css('transform', 'rotate(' + (x * 6) + 'deg)');
			workSession.count = x * 6;
		} else {
			alert('Work Time input should be an integer specifying the amount of time in minutes you want the work session to last.');
		}
	});

	$("#breakForm").submit(function(e) {
		e.preventDefault();
		var x = breakSession.input.val();
		if (Math.floor(x) == x && $.isNumeric(x)) {
			breakSession.outter.css('transform', 'rotate(' + (x * 6) + 'deg)');
			breakSession.count= x * 6;
		} else {
			alert('Break Time input should be an integer specifying the amount of time in minutes you want the break session to last.');
		}
	});

	$('#reset').click(function (){
		clearInterval(timeInterval);
		$('#start').text('Start');
		$('#start').removeClass('btn-danger').addClass('btn-success');
		reset(workSession);
		reset(breakSession);
		workSession.input.val(workSession.reset);
		workSession.count = workSession.reset * 6;
		workSession.outter.css('transform', 'rotate(' + workSession.count + 'deg)');
		breakSession.input.val(breakSession.reset);
		breakSession.count = breakSession.reset * 6;
		breakSession.outter.css('transform', 'rotate(' + breakSession.count + 'deg)');
		session = workSession;
	});

	function helper(objt) {
		if (end) { 
			startWork = Date.parse(new Date()) / 1000;
			endWork = startWork + (10 * session.count);
			session.reset = session.input.val();
		}
		objt.input.css('background-color', '#303030');
		objt.input.prop('disabled', true);
		objt.clock.off('click')
		objt.outter.off('click');
		end = false;
		return (endWork - startWork - 1);
	}

	function main() {
		var wav = 'http://mihailo.centarzatalente.com/sounds/click.mp3';
	    var audio = new Audio(wav);
		if ($('#start').text() == 'Start') {
			$('#start').text('Stop');
			$('#start').removeClass('btn-success').addClass('btn-danger');
			function init() {
				timeVar = helper(session);
				timeInterval = setInterval(function(){
					session.time.seconds = timeVar % 60;
					session.time.minutes = Math.floor(timeVar / 60) % 60;
					session.time.hours = Math.floor(timeVar / 3600) % 60;
					session.input.val(session.time.hours + ':' + session.time.minutes + ':' + session.time.seconds);
					if (session.time.seconds === 0) {
						session.count -= 6;
						session.outter.css('transform', 'rotate(' + session.count + 'deg)');
					}
					timeVar--;
					endWork--;			
					if(timeVar < 0){
						audio.play();
						reset(session);
						if (session == workSession) {
							session = breakSession;
							if (breakSession.reset !== '0' && breakSession.input.val() == '0') {
								breakSession.input.val(breakSession.reset);
								breakSession.count = breakSession.reset * 6;
								breakSession.outter.css('transform', 'rotate(' + breakSession.count + 'deg)');
							}
						} else {
							session = workSession;
							if (workSession.reset !== '0' && workSession.input.val() == '0') {
								workSession.input.val(workSession.reset);
								workSession.count = workSession.reset * 6;
								workSession.outter.css('transform', 'rotate(' + workSession.count + 'deg)');
							}
						}
						timeVar = helper(session);
					}
				}, 1000);
			}
			init();
		} else {
			clearInterval(timeInterval);
			$('#start').text('Start');
			$('#start').removeClass('btn-danger').addClass('btn-success');
		}
	}

	$('#start').click(main);
});