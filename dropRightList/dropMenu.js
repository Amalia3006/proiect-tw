function openvlist2(mouserEvent, subListnr) {
	closeElementByClassName("vlist2");
	closeElementByClassName("vlist3");

	let elem = document.getElementById(subListnr);
	if(elem)
		elem.style.display = "block";
}

function openvlist3(mouserEvent, subListnr) {
	closeElementByClassName("vlist3");

	let elem = document.getElementById(subListnr);
	if(elem)
		elem.style.display = "block";
}

function closeSearchMenu() {
	closeElementByClassName("vlist2");
	closeElementByClassName("vlist3");
}

function closeElementByClassName(element) {
	let sublists = document.getElementsByClassName(element);
	for (let i = sublists.length - 1; i >= 0; i--) {
		sublists[i].style.display = "none";
	}
}

