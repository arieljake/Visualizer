

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/dialogs",["Dialog.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
			this.noteDB = movie.databases.notesDB;
			this.constants = {
				keymap: {
					note: "n"
				}
			}
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			self.vis = self.createVis();
			self.dialog = new Dialog("/html/dialogs/notes.html");

			self.load(null,function()
			{
				self.startListening();
			});

			if (cb)
				cb();
		};

		scene.prototype.startListening = function(params,cb)
		{
			var self = this;

			$(document).bind("keypress", _.bind(self.handleKeyPress,self));
		};

		scene.prototype.handleKeyPress = function(e)
		{
			var self = this;

			var keymap = self.constants.keymap;
			var noteKeyCode = keymap.note.charCodeAt(0);
			var keyCode = e.keyCode;

			if (keyCode == noteKeyCode)
			{
				$(document).unbind("keypress", self.handleKeyPress)
				self.dialog.open(function()
				{
					var dialogContent = self.dialog.getContent();
					var submitButton = dialogContent.find("#submit");
					var notesInput = dialogContent.find("#notes");

					submitButton.bind("click", _.bind(self.handleNotesSubmit,self));
					notesInput.val(self.notes);
					notesInput.setCursorPosition(self.notes.length);
				});
			}
		};

		scene.prototype.handleNotesSubmit = function(e)
		{
			var noteInput = this.dialog.getContent().find("#notes");
			var notes = noteInput.val();

			noteInput.val("");

			this.noteDB.set("notes",notes);
			this.notesOutput.text(notes);
			this.dialog.close();
		}

		scene.prototype.load = function(params,cb)
		{
			var self = this;

			this.noteDB.get("notes",function(err,notes)
			{
				self.notes = notes;
				self.notesOutput = self.vis.append("text").text(self.notes).attr("y",50);

				if (cb)
					cb();
			});
		}

	})(window, "Notes");
});