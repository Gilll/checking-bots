
function initCapturing() {
	let isRecording = false,
		recordTime,
		recordingStart,
		recordingDuration,
		events = {}

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

			Object.keys(window).forEach(key => {
				if (/^on/.test(key)) {
					window.addEventListener(key.slice(2), event => {
						if (isRecording) {
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
						}
					});
				}
			});

			$("#start-recoding").click(function () {
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
			})
		}
	}
}

$(document).ready(function () {
	$("body").append(`
				<div id="capture-events">
					<div id="save-stats">
						<span id="start-recoding">start</span>
						<span id="stop-recoding">stop</span>
						<span id="save-to-file">save</span>
					</div>
				</div>
				<style>
					#save-to-file {
						display: none;
					}

					#stop-recoding {
						display: none;
					}

					#save-stats {
						position: fixed;
						background-color: black;
						color: white;
						font-size: 18px;
						z-index: 999999999999999999999;
						padding: 0.5em 1em;
						cursor: pointer;
						border-bottom-right-radius: 5px;
						top: 0;
						left: 0;
					}

					#save-stats span {
						margin-right: 1em;
					}

					#save-stats span:last-child {
						margin-right: 0;
					}
				</style>
			`)

	initCapturing().delegateEvents()
})
