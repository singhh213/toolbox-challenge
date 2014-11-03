//app.js: main javascript
"use strict"

var tiles = [];
var idx;
var tile;

for(idx = 1; idx <= 32; ++idx) {

	tiles.push({
		tileNum: idx,
		src: 'img/tile' + idx + '.jpg',
		flipped: false,
		matched: false
	});
} //for each tile


$(document).ready(function() {
	//catch click event of start game button

	//activates the help text popover
	$("[data-toggle='popover']").popover({trigger: 'hover'});

	$('#start-game').click(function() {
		
		tiles = _.shuffle(tiles); //shuffles the tiles using lodash
		var selectedTiles = tiles.slice(0, 8); //selects 8 random tiles
		var tilePairs = [];
		//pushes the tiles and a clone of each tile
		_.forEach(selectedTiles, function(tile) {
			tilePairs.push(tile);
			tilePairs.push(_.clone(tile));
		});
		tilePairs = _.shuffle(tilePairs);

		var gameBoard = $('#game-board');
		$("#game-board").empty(); //clears the gameboard when a new game starts
		//creates the game board of 16 tiles
		var row = $(document.createElement('div'));
		var img;
		_.forEach(tilePairs, function(tile, elemIndex) {
			if (elemIndex > 0 && 0 === (elemIndex % 4)) {
				gameBoard.append(row);
				row = $(document.createElement('div'));
			}
			img = $(document.createElement('img'));
			img.attr ({
				src: 'img/tile-back.png',
				alt: 'tile' + tile.tileNum
			});

			img.data('tile', tile);

			row.append(img);
		});
		gameBoard.append(row);

		//get starting millseconds
		var interval;
		var startTime = Date.now();
		window.clearInterval(interval); //resets elapsed time when new game starts
		interval = window.setInterval(function() {
			var elapsedSeconds = (Date.now() - startTime) / 1000;
			elapsedSeconds = Math.floor(elapsedSeconds);
			$('#elapsed-seconds').text(elapsedSeconds + ' seconds');
		}, 1000);

		var prevImage;
		var prevTile;
		var matches = 0;
		var remaining = 8;
		var misses = 0;
		var reset;

		//displays the current stats upon starting a new game
		$('#remaining').text(remaining + " pairs");
		$('#misses').text(misses);
		$('#matches').text(matches);

		//hides the win message when a new game starts
		$('#gameOver').css('display', 'none');

		//event handler function when any of the 16 tiles are clicked on
		$('#game-board img').click(function() {
			//if tiles are done being flipped over after a no match
			if (!reset) {

				var clickedImg = $(this);
				var tile = clickedImg.data('tile');
				
				if (!tile.flipped) {

					flipTile(tile, clickedImg);

					//this if statement manages the first turn of the player
					if (!prevImage) {
						prevImage = clickedImg;
						prevTile = tile;
					} else { 
					//manages the second turn of the player
					//checks if the 2 tiles match, if not, flips them back over
						if (prevTile.tileNum == tile.tileNum) {
							matches++;
							remaining--;
							prevImage = null;
						} else {
							reset = true;
							setTimeout(function() {
								flipTile(prevTile, prevImage);
								flipTile(tile, clickedImg);
								prevImage = null;
								reset = false;
								}, 1000
							);
							misses++;
						}

						//displays updated stats after each turn
						$('#remaining').text(remaining + " pairs");
						$('#misses').text(misses);
						$('#matches').text(matches);

						//if all tile pairs have been matched, displays win message
						if (remaining == 0) {
							$('#gameOver').css('display', 'block');
						}
					}
				}
			}
		});
	});
});

//flips the passed tile over to either display the tile-back or the image.
function flipTile(tile, img) {
	console.log(img);
	img.fadeOut(100, function() {
		if (tile.flipped) {
		img.attr('src', 'img/tile-back.png');
		}
		else {
			img.attr('src', tile.src);
		}
		tile.flipped = !tile.flipped;
		img.fadeIn(100);
	});

}