

//console.log(appVersion)
var so = 'Sistema Operativo';
function SO()
 {
	 	if(navigator.appVersion.indexOf('win') != -1)
 	{
	 		so = 'Windows User';
 	}
	else if(navigator.appVersion.indexOf('X11') != -1)
 	{
	 		so = 'Linux User';
 	}
 	else if(navigator.appVersion.indexOf('mac') != -1)
 	{
	 		so = 'Macintosh User';
 	}
 	return so
 }

const ost = document.getElementById('os')
ost.style.color = 'yellow'
ost.innerHTML = SO()