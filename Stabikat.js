{
	"translatorID": "599ff9de-2049-4b99-ad67-691bde0df74a",
	"label": "Stabikat",
	"creator": "Marcel Klotz",
	"target": "^https?://(www\\\\.)?stabikat.de/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcs",
	"lastUpdated": "2021-03-19 19:51:41"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2021 Marcel Klotz

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

function attr(docOrElem, selector, attr, index) {
	var elem = index ? docOrElem.querySelectorAll(selector).item(index) : docOrElem.querySelector(selector);
	return elem ? elem.getAttribute(attr) : null;
}

function typeMapper(type) {
	switch (type) {
		case 'Bücher' || 'Books':
			return 'book';
		case 'Briefe' || 'Letters':
			return 'letter';
		case 'Musikalien' || 'Music':
			return 'music';
		case 'Zeitschriften/Serien (ohne Online-Zeitschr.)' || 'Periodicals (non-online)':
			return 'periodicals_non-online';
		case 'Filme, Videos, etc.' || 'Audio visual':
			return 'film';
		case 'Tonträger' || 'Sound':
			return 'audioRecording';
		case 'Online-Zeitschriften' || 'Online periodicals':
			// periodicals -- in contrast to their articles -- will use book-entries, as there is no specific type
			return 'periodicals_online';
		case 'Bilder' || 'Pictures':
			return 'picture';
		case 'Datenträger' || 'Software':
			return 'Datenträger';
		case 'E-Books/Online Ressourcen' || 'Online resources (without periodicals)':
			// periodicals -- in contrast to their articles -- will use book-entries, as there is no specific type
			return 'book';
		case 'Kartenmaterial' || 'Cartography':
			return 'map';
		case 'Mikroformen' || 'Microfilm':
			return 'microfilm';
		case 'Aufsätze' || 'Articles':
			return 'article';
		case 'Manuskripte' || 'Handwriting':
			return 'manuscript';
		case 'Spiele, Skulpturen, etc.' || 'Games, Scupture, etc.':
			return 'other';
		default:
			return 'book';
	}
}

function detectWeb(doc, url) {
	if (url.includes('ACT=SRCH') && getSearchResults(doc, true)) {
		return 'multiple';
	}
	else {
		var type = attr(doc, "#maticon", "alt");
		return typeMapper(type)
	}
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (!items) {
				return true;
			}
			var articles = [];
			for (var i in items) {
				articles.push(i);
			}
			ZU.processDocuments(articles, scrape);
			return false;
		});
	}
	else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
	var type = detectWeb(doc, url);
	// get the identifaction number necessary for the api call
	var permalink = attr(doc, ".cnt > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)", "href");
	var ppn = permalink.slice(permalink.indexOf("PPN=") + 4);
	var catalogid = "stabikat";
	var translator = Zotero.loadTranslator('import');
	translator.setTranslator('041335e4-6984-4540-b683-494bc923057a'); 
	translator.setString(JSON.stringify({ ppn: [ppn], catalogid }));
	translator.translate()
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	var rows = doc.querySelectorAll('.hit');
	for (var i = 0; i < rows.length; i++) {
		var href = rows[i].childNodes[1] && rows[i].childNodes[1].href ? rows[i].childNodes[1].href : "";
		var title = ZU.trimInternal(rows[i].textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}


/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://stabikat.de/DB=1/XMLPRS=N/PPN?PPN=1737430592",
		"items": [
			{
				"itemType": "book",
				"title": "Die Spur der Gesellschaft: Reflexionen zur Gesellschaftstheorie nach Luhmann",
				"creators": [
					{
						"firstName": "Tobias",
						"lastName": "Arenz",
						"creatorType": "author"
					}
				],
				"date": "2020",
				"ISBN": "9783748911661",
				"edition": "Erste Auflage",
				"extra": "Hochschulschrift\nDissertation (Deutsche Sporthochschule Köln, 2019)\nAngesichts gegenwärtiger Krisenerfahrungen erlebt die Soziologie ein comeback des Gesellschaftsbegriffs. Hatte man diesen zunächst verabschiedet, weil seine häufig normativ überfrachteten Ganzheitsvorstellungen dem pluralistischen Anspruch der westlichen Welt nicht gerecht wurden, so stellt sich heute erneut die Frage nach der Einheit des Sozialen. Das Problem mit radikalem Fokus gerade auf die Differenz des Sozialen zu bearbeiten, war Niklas Luhmanns Strategie. Seine Systemtheorie sollte Gesellschaft möglichst abstrakt und komplexitätsbewusst beschreiben. Ihr formal-funktionalistischer Blick kann den neuen Herausforderungen jedoch nicht mehr adäquat begegnen. Tobias Arenz’ These lautet deshalb, dass Luhmann zu überwinden ist – jedoch von innen heraus, um nicht hinter ihn zurückzufallen. Entscheidend dafür ist die Reflexion der impliziten Normativität der Systemtheorie, die im Anschluss an das Theorieprogramm Mediale Moderne und das formkritische Rechtsverständnis Christoph Menkes erfolgt. Die Studie entwickelt dergestalt ein neues, mit Pluralität zu vereinbarendes Normativitätskonzept. Ihre hochaktuelle Pointe lautet, dass jede wissenschaftliche Analyse sozialer Verhältnisse notwendig innerhalb eines normativen gesellschaftstheoretischen Rahmens durchgeführt wird, der in der Moderne inhaltlich durch die interne Verknüpfung von Freiheit und Herrschaft bestimmt ist.",
				"libraryCatalog": "Stabikat",
				"numPages": "1 Online-Ressource (266 Seiten)",
				"place": "Weilerswist",
				"publisher": "Velbrück Wissenschaft",
				"shortTitle": "Die Spur der Gesellschaft",
				"attachments": [],
				"tags": [],
				"notes": [
					{
						"note": "BK: '71.02', '71.11'\n \n'VLBWG' [\"1720\"]",
						"title": "Classification Data"
					}
				],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://stabikat.de/DB=1/XMLPRS=N/PPN?PPN=1693565242",
		"items": [
			{
				"itemType": "book",
				"title": "The Dark Energy Survey: the story of a cosmological experiment",
				"creators": [
					{
						"firstName": "Ofer",
						"lastName": "Lahav",
						"creatorType": "editor"
					},
					{
						"firstName": "Lucy",
						"lastName": "Calder",
						"creatorType": "editor"
					},
					{
						"firstName": "Julian",
						"lastName": "Mayers",
						"creatorType": "editor"
					},
					{
						"firstName": "Joshua A.",
						"lastName": "Frieman",
						"creatorType": "editor"
					}
				],
				"date": "2021",
				"ISBN": "9781786348357",
				"callNumber": "10 A 109104",
				"extra": "Aufsatzsammlung\nOfer Lahav (HerausgeberIn)\nLucy Calder (HerausgeberIn)\nJulian Mayers (HerausgeberIn)\nJoshua A. Frieman (HerausgeberIn)\nIncludes bibliographical references and index\n\"This book is about the Dark Energy Survey, a cosmological experiment designed to investigate the physical nature of dark energy by measuring its effect on the expansion history of the universe and on the growth of large-scale structure. The survey saw first light in 2012, after a decade of planning, and completed observations in 2019. The collaboration designed and built a 570-megapixel camera and installed it on the four-metre Blanco telescope at the Cerro Tololo Inter-American Observatory in the Chilean Andes. The survey data yielded a three-dimensional map of over 300 million galaxies and a catalogue of thousands of supernovae. Analysis of the early data has confirmed remarkably accurately the model of cold dark matter and a cosmological constant. The survey has also offered new insights into galaxies, supernovae, stellar evolution, solar system objects and the nature of gravitational wave events. A project of this scale required the long-term commitment of hundreds of scientists from institutions all over the world. The chapters in the first three sections of the book were either written by these scientists or based on interviews with them. These chapters explain, for a non-specialist reader, the science analysis involved. They also describe how the project was conceived, and chronicle some of the many and diverse challenges involved in advancing our understanding of the universe. The final section is trans-disciplinary, including inputs from a philosopher, an anthropologist, visual artists and a poet. Scientific collaborations are human endeavours and the book aims to convey a sense of the wider context within which science comes about. This book is addressed to scientists, decision makers, social scientists and engineers, as well as to anyone with an interest in contemporary cosmology and astrophysics\"--",
				"libraryCatalog": "Stabikat",
				"numPages": "xxii, 421 Seiten",
				"place": "Tokyo",
				"publisher": "World Scientific Publishing",
				"shortTitle": "The Dark Energy Survey",
				"attachments": [],
				"tags": [],
				"notes": [
					{
						"note": "LCC: 'QB791.3'\nDDC: '523.01'\nBK: '39.30'\n RVK: 'US 3460'\n",
						"title": "Classification Data"
					}
				],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://stabikat.de/DB=1/TTL=1/PRS/PPN?PPN=649879910",
		"items": [
			{
				"itemType": "book",
				"title": "Systemtheoretische Literaturwissenschaft: Begriffe - Methoden - Anwendungen",
				"creators": [],
				"date": "2011",
				"ISBN": "9783110219012",
				"extra": "Niels Werber \nIncludes bibliographical references\nThis handbook gives an overview of systems theory in the field of literature, culture and media studies. The individual entries provide an introduction to the key concepts and problems in such a way that their added heuristic value becomes clear, without requiring a detailed understanding of the whole architecture of Luhmann's theory for this purpose. The book tests these concepts and problems in exemplary applications and thus demonstrates how works of art, texts and media can be observed in concrete individual analyses from a systems-theoretical perspective",
				"libraryCatalog": "Stabikat",
				"numPages": "Online-Ressource (IX, 514 S.))",
				"place": "Berlin [u.a.]",
				"publisher": "de Gruyter",
				"shortTitle": "Systemtheoretische Literaturwissenschaft",
				"attachments": [],
				"tags": [],
				"notes": [
					{
						"note": "LCC: 'PN6231.S93'\nDDC: '809.001/1'\n RVK: 'EC 1850', 'EC 1820', 'EC 1680'\n\n'BISAC' [\"LIT000000\",\"LIT004130\"]\n'VLBWG' [\"9562\"]",
						"title": "Classification Data"
					}
				],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
