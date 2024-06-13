
function initCapturing() {
	let isRecording = false,
		recordTime,
		recordingStart,
		recordingDuration,
		events = {};

	let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	console.log(isMobile);

	let eventsInfo = {
		mouse: {
			mouseIsMoving: false,
			lastX: 0,
			offset: document.body.offsetWidth
		},
		click: {
			notTrusted: false,
			downTime: 0,
			upTime: 0,
			activeEvents: {
				mouseDown: false,
				mouseUp: false
			}
		},
		touch: {
			notTrusted: false,
			downTime: 0,
			upTime: 0,
			endTime: 0,
			activeEvents: {
				touchDown: false,
				touchMoving: false
			}
		},
		scroll: {
			notTrusted: false,
			wheel: false
		}
	}

	const startRecording = () => {
		recordTime = 0
		isRecording = true
		events = {}
		recordingStart = Date.now()
		$("#start-recoding").hide()
		$("#stop-recoding").show()
		$("#save-to-file").hide()
	}

	const stopRecording = () => {
		if (isRecording) {
			recordingDuration = Date.now() - recordingStart
		}
		isRecording = false
		events.browser = checkBrowser()
		events.webGl = getGPUInfo()
		events.recordingDuration = recordingDuration
		$("#start-recoding").show()
		$("#stop-recoding").hide()
		$("#save-to-file").show()
	}

	function getGPUInfo() {
		let canvas = document.createElement('canvas').getContext('webgl');
		let renderer = canvas.getExtension('WEBGL_debug_renderer_info');
		if (renderer) {
			return {
				video: canvas.getParameter(renderer.UNMASKED_RENDERER_WEBGL),
				vendor:  canvas.getParameter(renderer.UNMASKED_VENDOR_WEBGL)
			}
		}
		return false;
	}

	const checkBrowser = () => {
		let nVer = navigator.appVersion;
		let nAgt = navigator.userAgent;
		let browserName  = navigator.appName;
		let fullVersion  = ''+parseFloat(navigator.appVersion);
		let majorVersion = parseInt(navigator.appVersion,10);
		let nameOffset,verOffset,ix;

		if ((verOffset=nAgt.indexOf("OPR"))!=-1) {
			browserName = "Opera";
			fullVersion = nAgt.substring(verOffset+4);
			if ((verOffset=nAgt.indexOf("Version"))!=-1)
				fullVersion = nAgt.substring(verOffset+8);
		} else if ((verOffset=nAgt.indexOf("Edg"))!=-1) {
			browserName = "Microsoft Edge";
			fullVersion = nAgt.substring(verOffset+4);
		} else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
			browserName = "Microsoft Internet Explorer";
			fullVersion = nAgt.substring(verOffset+5);
		} else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
			browserName = "Chrome";
			fullVersion = nAgt.substring(verOffset+7);
		} else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
			browserName = "Safari";
			fullVersion = nAgt.substring(verOffset+7);
			if ((verOffset=nAgt.indexOf("Version"))!=-1)
				fullVersion = nAgt.substring(verOffset+8);
		} else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
			browserName = "Firefox";
			fullVersion = nAgt.substring(verOffset+8);
		} else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
			(verOffset=nAgt.lastIndexOf('/')) )
		{
			browserName = nAgt.substring(nameOffset,verOffset);
			fullVersion = nAgt.substring(verOffset+1);
			if (browserName.toLowerCase()==browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}

		if ((ix=fullVersion.indexOf(";"))!=-1)
			fullVersion=fullVersion.substring(0,ix);
		if ((ix=fullVersion.indexOf(" "))!=-1)
			fullVersion=fullVersion.substring(0,ix);

		majorVersion = parseInt(''+fullVersion,10);
		if (isNaN(majorVersion)) {
			fullVersion  = ''+parseFloat(navigator.appVersion);
			majorVersion = parseInt(navigator.appVersion,10);
		}

		return {
			browserName: browserName,
			fullVersion: fullVersion,
			majorVersion: majorVersion,
			appName: navigator.appName,
			userAgent: navigator.userAgent
		}

	}

	return {
		delegateEvents: function () {
			//setInterval(() => { $("h1").click(); },1000)

			Object.keys(window).forEach(key => {
				if (/^on/.test(key)) {
					window.addEventListener(key.slice(2), event => {
						if (event.type !== 'message') {
							console.log(event.type);
						}
						if (event.type === 'mousemove') {
							eventsInfo.mouseIsMoving = true;
							eventsInfo.mouse.lastX = event.clientX
							$("#mouse-status").text("Ok");
							if (!event.isTrusted) {
								$("#mouse-status").hide();
								$("#mouse-err-trusted").show();
							}
						}
						if (event.type === 'click') {
							$("#click-status").text("Ok");
							if (!event.isTrusted) {
								$("#click-status").hide();
								$("#click-err-trusted").show();
							}
							if (eventsInfo.click.activeEvents.mouseDown && eventsInfo.click.activeEvents.mouseUp) {
								eventsInfo.click.activeEvents.mouseDown = false;
								eventsInfo.click.activeEvents.mouseUp = false;
							} else {
								$("#click-status").hide();
								$("#click-err-not-full").show();
							}
						}
						if (event.type === 'mousedown') {
							eventsInfo.click.downTime = Date.now();
							eventsInfo.click.activeEvents.mouseDown = true;
						}
						if (event.type === 'mouseup') {
							eventsInfo.click.upTime = Date.now();
							if (eventsInfo.click.upTime && eventsInfo.click.downTime && !isMobile) {
								let diff = eventsInfo.click.upTime - eventsInfo.click.downTime
								if (diff < 16) {
									$("#click-status").hide();
									$("#click-err-speed").text("Кнопка нажата/отпущена за " + diff + "ms" ).show();
								}
							}
							eventsInfo.click.activeEvents.mouseUp = true;
						}

						if (event.type === 'touchstart') {
							$("#touch-status").text("Ok")
							if (!event.isTrusted) {
								$("#touch-status").hide();
								$("#touch-err-trusted").show();
							}
							eventsInfo.touch.downTime = Date.now();
							eventsInfo.touch.activeEvents.touchDown = true;
						}
						if (event.type === 'touchend') {
							if (!event.isTrusted) {
								$("#touch-status").hide();
								$("#touch-err-trusted").show();
							}
							if (eventsInfo.touch.downTime) {
								let diff = Date.now() - eventsInfo.touch.downTime
								if (diff < 16) {
									$("#touch-status").hide();
									$("#touch-err-speed").text("Прикосновение нажато/отпущено за " + diff + "ms" ).show();
								}
							}

							if (eventsInfo.touch.activeEvents.touchDown) {
								eventsInfo.touch.activeEvents.touchDown = false;
							} else {
								$("#touch-status").hide();
								$("#touch-err-not-full").show();
							}
							eventsInfo.touch.endTime = Date.now();
						}

						if (event.type === 'touchmove') {
							eventsInfo.touch.activeEvents.touchMoving = true;
						}

						if (event.type === 'wheel') {
							eventsInfo.scroll.wheel = true;
						}

						if (event.type === 'scroll') {
							if (!event.isTrusted) {
								$("#scroll-status").hide();
								$("#scroll-err-trusted").show();
							}
						}

						if (event.type === 'scrollend') {
							if (isMobile) {
								if (!eventsInfo.touch.activeEvents.touchMoving) {
									$("#scroll-status").hide();
									$("#scroll-err-flat").text(Date.now() - eventsInfo.touch.endTime).show()
								}
							} else {
								if (!eventsInfo.scroll.wheel) {
									if ((eventsInfo.mouse.lastX < eventsInfo.mouse.offset)) {
										$("#scroll-status").hide();
										$("#scroll-err-flat").show()
									}
								}
							}
							eventsInfo.scroll.wheel = false;
							$("#scroll-status").text('Ok')
						}

						/*if (isRecording) {
							let parsedEvents = {}
							if (!events[event.type]) {
								events[event.type] = []
							}
							for (let eventKey in event) {
								if (typeof event[eventKey] !== 'function' && typeof event[eventKey] !== 'object') {
									parsedEvents[eventKey] = event[eventKey]
								}
							}
							events[event.type].push(parsedEvents)
						}*/
					});
				}
			});

			/*$("#start-recoding").click(function () {
				startRecording()
			})

			$("#stop-recoding").click(function () {
				stopRecording()
			})

			function writeFile(name, value) {
				let val = value;
				if (value === undefined) {
					val = "";
				}
				let download = document.createElement("a");
				download.href = "data:text/plain;content-disposition=attachment;filename=file," + val;
				download.download = name;
				download.style.display = "none";
				download.id = "download"; document.body.appendChild(download);
				document.getElementById("download").click();
				document.body.removeChild(download);
			}

			$("#save-to-file").click(function () {
				writeFile("data.txt", JSON.stringify(events));
			})*/
		}
	}
}

$(document).ready(function () {
	$("body").append(`
				<div id="checking-events">
					<div class="event-title">Клики</div>
					<div class="event-status" id="click-status">Не обнаружено</div>
					<div class="err-list">
						<div class="event-err" id="click-err-trusted">Не инициирован пользователем</div>
						<div class="event-err" id="click-err-speed"></div>
						<div class="event-err" id="click-err-not-full">Не зафиксировано нажатия левого клика</div>
					</div>
					<div class="event-title">Движение мыши</div>
					<div class="event-status" id="mouse-status">Не обнаружено</div>
					<div class="err-list">
						<div class="event-err" id="mouse-err-trusted">Не инициирован пользователем</div>
					</div>
					<div class="event-title">Скролл</div>
					<div class="event-status" id="scroll-status">Не обнаружено</div>
					<div class="err-list">
						<div class="event-err" id="scroll-err-trusted">Не инициирован пользователем</div>
						<div class="event-err" id="scroll-err-flat">Скролл без колесика мыши или интефейса</div>
					</div>
					<div class="event-title">Тач</div>
					<div class="event-status" id="touch-status">Не обнаружено</div>
					<div class="err-list">
						<div class="event-err" id="touch-err-trusted">Не инициирован пользователем</div>
						<div class="event-err" id="touch-err-speed"></div>
						<div class="event-err" id="touch-err-not-full">Не зафиксировано нажатия</div>
					</div>
				</div>
				<style>
					#checking-events {
						position: fixed;
						background-color: black;
						color: white;
						font-size: 16px;
						z-index: 999999999999999999999;
						padding: 0.5em 1em;
						cursor: pointer;
						border-bottom-right-radius: 5px;
						top: 0;
						right: 0;
						width: 15rem;
					}

					.event-title {
						margin-bottom: 0.5rem;
					}

					.err-list {
						margin-bottom: 1.5rem;
						color: darkred;
					}

					.event-err {
						margin-bottom: 0.5rem;
						display: none;
					}
					.event-err:last-child {
						margin-bottom: 0;
					}
				</style>
			`)

	initCapturing().delegateEvents()
})
