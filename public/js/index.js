/**
* Author: Pierre-Alexandre STERBIK
* Version: 1.0.0
* Signature: Manianise
*/

'use strict';

let Fake, i=0, my_username = '';	
const socket = io();		


$(document).ready( () => {	
	new MainChat();
});


// A base class is defined using the new reserved 'class' keyword
class MainChat  {
	// constructor
	constructor () {
		$('.messages-content').mCustomScrollbar();
		MainChat.LoadEventHandlers();		
	}	
	
	static setDate(){
	  let d = new Date();
	  let m = d.getMinutes();
	  $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
	}

	static splitLongWords(value) {

		const maxWordLength = 30;
		const words = value.split(' ');
		const result = [];
	
		words.forEach(word => {
			while (word.length > maxWordLength) {
				result.push(word.slice(0, maxWordLength));
				word = word.slice(maxWordLength);
			}
			result.push(word);
		});
	
		return result.join(' ');
	}
	
	static insertMessage() {
	  const msg = this.splitLongWords($('.message-input').val());
	  if ($.trim(msg) == '') return false;
	  $('.message-input').val(null);
	  MainChat.updateScrollbar();
	  // tell server to execute 'sendchat' and send along one parameter
	  socket.emit('sendchat', msg);
	}
		
	static LoadEventHandlers() {
			Fake = [ 'Bonjour, je suis Mojo, votre chatssistant ! Dites moi ce que je peux faire pour vous ?', 'Je suis désolé, pour le moment mes phrases sont pré-enregistrées, mais je vais aller mieux bientôt rassurez-vous !', 'How are you?', 'Not too bad, thanks', 'What do you do?', 'That\'s awesome', 'Codepen is a nice place to stay', 'I think you\'re a nice person', 'Why do you think that?', 'Can you explain?', 'Anyway I\'ve gotta go now', 'It was a pleasure chat with you', 'Time to make a new codepen', 'Bye', ':)' ]

			
			$('.message-submit').click( () => {
			  MainChat.insertMessage();
			});
			
			$(window).on('keydown', e => {
			  if (e.which == 13) {
				MainChat.insertMessage();
				return false;
			  }
			});
			
			
			// listener, whenever the server emits 'updatechat', this updates the chat body
			socket.on('updatechat',  (username, data) => {
				if(username == 'Chat Bot'){
					$('<div class="message loading new"><figure class="avatar"><img src="/public/img/sa.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
					MainChat.updateScrollbar();
					setTimeout( () => {
					$('.message.loading').remove();
					$('<div class="message new"><figure class="avatar"><img src="/public/img/sa.png" /></figure>' + data + '</div>').appendTo($('.mCSB_container')).addClass('new');
						MainChat.setDate();
						MainChat.updateScrollbar();
					}, 1000 + (Math.random() * 20) * 100);
				} else {	
					setTimeout( () => {
					$('.message.loading').remove();
					$('<div class="message message-personal">' + data + '</div>').appendTo($('.mCSB_container')).addClass('new');
						MainChat.setDate();
						MainChat.updateScrollbar();
					}, 100);
					
					setTimeout( () =>	MainChat.fakeMessage(), 1000 + (Math.random() * 20) * 100);
				}
			});
			
			// listener, whenever the server emits 'msg_user_handle', this updates the chat body
			socket.on('msg_user_handle', (username, data) => {
				setTimeout( () => {
				$('.message.loading').remove();
				$('<div class="message message-personal">' + data + '</div>').appendTo($('.mCSB_container')).addClass('new');
					MainChat.setDate();
					MainChat.updateScrollbar();
				}, 1000 + (Math.random() * 20) * 100);
			});

			
			// listener, whenever the server emits 'msg_user_found'
			socket.on('msg_user_found', username => socket.emit('msg_user', username, my_username, prompt("Type your message:")));
			
			
			// listener, whenever the server emits 'store_username', this updates the username
			socket.on('store_username', username => my_username = username);
	}
	
	static updateScrollbar() {
		$('.messages-content').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
			scrollInertia: 10,timeout: 0
		});
	}
	
	// when the user sends a private msg to a user id, first find the username
	static sendmsg (id) { 
		socket.emit('check_user', my_username, id);
	}
	
	static fakeMessage() {
		if ($('.message-input').val() != '') return false;
		$('<div class="message loading new"><figure class="avatar mojo shadow-sm btn btn-light rounded-circle"><img src="/public/img/mojo.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
			MainChat.updateScrollbar();
			setTimeout( () => {
					$('.message.loading').remove();
					$('<div class="message new"><figure class="avatar mojo shadow-sm btn btn-light rounded-circle"></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
						MainChat.setDate();
						MainChat.updateScrollbar();
						i++;
			}, 1000 + (Math.random() * 20) * 100);
	}

	static aiAnswer() {

	}
	
}


function handleToggle(arr) {
	arr.forEach(e => document.querySelector(e).classList.toggle('active'))
	}
	
function bubbleCheck(selector) {

		let check = false;

		document.querySelectorAll(selector).forEach(e => {
			if (e.classList.contains('active')) {
				check = true;
			}
		})
		return check;
	}

function formReset() {

	document.querySelectorAll('.slider-img').forEach((e, index) => index !== 0 ? e.classList.remove('active') : 			e.classList.add('active'))

	bubbleCheck('#call') && handleToggle(['#call'])

	if(!bubbleCheck('#form-chatssistant') ) {
		handleToggle(['#form-chatssistant'])
	} else {
		handleToggle(['#form-chatssistant', '#wait'])
		setTimeout(() => {handleToggle(['#wait'])}, 3000)
	}

}

function checkCheckBoxes(selector) {
	
	let checked = false;
	let elt = document.querySelectorAll(selector);
	
	elt.forEach(e => {
		if(e.checked) {
			checked = true
		}
	})
	return checked;
}

function promiseCheckBoxes(selector) {
	return new Promise ((res, rej) => {
		!checkCheckBoxes(selector) ? res(true) : rej(false)
	})
}
	
function promiseSelect(selector) {
	
	let elt = document.querySelector(selector)
	return new Promise ((resolve, reject) => {
	elt.value === '' ? resolve(true) : reject(false)
		
	})
	
}

function resolvePromise({
	call : call,
	promiseSelector : promiseSelector,
	feedBackSelector : feedBackSelector = promiseSelector,
	handleToggle : array
}) {
	call(promiseSelector)
		.then((result) => {
			document.querySelector(feedBackSelector).classList.add('is-invalid')
		})
		.catch((error) => {
			handleToggle(array)
		})
}

window.addEventListener('load', () => {

	setInterval(() => {
		if(!bubbleCheck('.bubbles')) {
			$('#call').toggleClass('active');
			setTimeout(() => {
					$('#call').toggleClass('active'); 
			}, 3000)	
		}
	}, 10000);

})










