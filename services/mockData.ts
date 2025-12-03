import { Book } from '../types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
    // Updated to direct link to avoid redirects
    audioUrl: 'https://ia800207.us.archive.org/27/items/great_gatsby_1603_librivox/greatgatsby_01_fitzgerald_128kb.mp3',
    duration: 1800,
    color: '#1a237e',
    type: 'HYBRID',
    isDownloaded: false,
    textContent: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'",
    syncData: [
      { start: 0, end: 4, text: "In my younger and more vulnerable years" },
      { start: 4, end: 8, text: "my father gave me some advice" },
      { start: 8, end: 12, text: "that I've been turning over in my mind ever since." },
      { start: 13, end: 17, text: "'Whenever you feel like criticizing any one,'" },
      { start: 17, end: 19, text: "he told me," },
      { start: 19, end: 24, text: "'just remember that all the people in this world" },
      { start: 24, end: 28, text: "haven't had the advantages that you've had.'" }
    ]
  },
  {
    id: '2',
    title: 'Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg',
    // Updated to direct link
    audioUrl: 'https://ia801407.us.archive.org/23/items/adventures_sherlock_holmes_librivox/adventures_of_sherlock_holmes_01_doyle_128kb.mp3',
    duration: 1500,
    color: '#3e2723',
    type: 'AUDIO',
    isDownloaded: false,
    textContent: null,
  },
  {
    id: '3',
    title: 'Alice in Wonderland',
    author: 'Lewis Carroll',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Alice%27s_Adventures_in_Wonderland_cover_%281865%29.jpg',
    audioUrl: null,
    duration: 0,
    color: '#006064',
    type: 'EBOOK',
    isDownloaded: false,
    textContent: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversation?'",
  }
];