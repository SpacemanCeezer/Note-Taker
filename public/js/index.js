let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;
let activeNote;

// Function to show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Function to render the list of note titles
const renderNoteList = async () => {
  const notesResponse = await fetch('/api/notes');
  const notes = await notesResponse.json();

  if (!noteList) {
    console.error('Note list container not found.');
    return;
  }

  noteList.innerHTML = '';

  if (notes.length === 0) {
    const noNotesLi = document.createElement('li');
    noNotesLi.classList.add('list-group-item');
    noNotesLi.innerText = 'No saved Notes';
    noteList.appendChild(noNotesLi);
  } else {
    notes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');

      if (!noteList) {
        console.error('Note list container not found.');
        return;
      }

      li.dataset.note = JSON.stringify(note);

      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = note.title;
      spanEl.addEventListener('click', handleNoteView);

      li.appendChild(spanEl);

      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      delBtnEl.addEventListener('click', handleNoteDelete);

      li.appendChild(delBtnEl);

      noteList.appendChild(li);
    });
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  })
    .then(() => renderNoteList())
    .then(() => renderActiveNote());
};

// ... (previous code)

// Function to handle deleting a note
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(() => renderNoteList())  // Update the note list after deletion
    .then(() => renderActiveNote());  // Clear the form after deletion
};

// ... (remaining code)


// Function to handle viewing a note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Function to handle creating a new note view
const handleNewNoteView = (e) => {
  activeNote = {};
  hide(clearBtn); // Add this line to hide the clearBtn
  renderActiveNote();
};


// Function to handle rendering buttons
const handleRenderBtns = () => {
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Function to render the active note
const renderActiveNote = () => {
  // Initialize activeNote to an empty object if not defined
  activeNote = activeNote || {};

  // Set the values of the form fields to the properties of the activeNote
  noteTitle.value = activeNote.title || '';
  noteText.value = activeNote.text || '';

  // Call the function to handle rendering buttons
  handleRenderBtns();
};

document.addEventListener('DOMContentLoaded', () => {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);

  renderNoteList();
});
