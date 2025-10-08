import Header from "./components/Header";
import { languages } from "./utility/languages";
import { useState } from "react";
import { clsx } from "clsx";
import { getFairwellText } from "./utility/utils";
import {getRandomWord} from './utility/utils'
import Confetti from 'react-confetti'
import VideoNavigate from './components/VideoNavigate.jsx';



export default function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord()); //getRandomWord need to be saved. 
  const [guessedLetters, setGuessedLetters] = useState([]);

  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // console.log(wrongGuessCount); //gives the wrong guess letters length, so that we can get our threshold for game over. 

  // number of attempts is 
  const attempsLeft = languages.length - 1; 


  // check if all elements of current word is present in gussed letters or not. So use every. But first convert the string into array 
  const isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter)); //returns true or false. 
  const isGameLost = wrongGuessCount >= attempsLeft
  const isGameOver = isGameWon || isGameLost; // only one true then true (within 8 gusses user should win the game)

  // last gussed letter correct or incorrect
  const lastGuess = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuess && !currentWord.includes(lastGuess)
  

  const addGussedLetter = (letter) => {
    // combine prevLetters with current letters within a single array, only if current letter is a part of prevLetters
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  };

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase(): ""}
      </span>
    );
  });

  const languageElements = languages.map((language, index) => {
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };

    // calculate length, if 0 then chip class, if not 0 then lost class
    const isLanguageLost = index < wrongGuessCount //returns a boolean result, 
    // 0 < 0 returns false
    // 0 < 1 returns true (0 index is lost)
    // 1 < 1 (returns false)
    // 1 < 2 (returns true)

    const className = clsx("chip", isLanguageLost && "lost");

    return (
      <span className={className} style={styles} key={language.name}>
        {language.name}
      </span>
    );
  });

  const keyBoardElements = alphabet.split("").map((letter) => {
    const isGussed = guessedLetters.includes(letter); //check if letter word is gussed or not i.e present in the gussedletters or not
    const isCorrect = isGussed && currentWord.includes(letter); //thne check that current letter is present both in gussedletter and currentWord or not.
    const isWrong = isGussed && !currentWord.includes(letter); //gussed letter array and original word array does not match

    // apply a class to change the key colrs according to isCorrect or isWrong. We use clsx package for that

    // apply className = {correct} if gussed letter is correct and wrong for wrong guess
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        key={letter}
        onClick={() => addGussedLetter(letter)} //current letter goes to addGuessLetter
        className={className}
        disabled = {isGameOver && true}
        aria-disabled = {guessedLetters.includes(letter)}
        aria-label= {`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx( "game-status", {
    won: isGameWon,  //className won properties are added when game won
    lost: isGameLost, //className lost properties are added when game is lost
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect){
      return <p className={gameStatusClass}>{getFairwellText(languages[wrongGuessCount - 1].name)}</p>
    }
    if(!isGameOver) {
      return null
    }
    if(isGameWon){
      return (  
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      ) 
    }else {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
  }


  // set everything up from starting. Also reveal the word if the user does not gusse it right
  const newGame = () => {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  return (
    <main>
      <Header/>
      <VideoNavigate/>

      <section 
        aria-live="polite" 
        role="status" 
        className= {gameStatusClass}
      >
        <h1 style={{textDecoration: "underline"}}>Game Environment</h1>
        {renderGameStatus()}
      </section>

      <section className="language-chips">{languageElements}</section>

      <section className="word">{letterElements}</section>

      <section 
        className="sr-only" 
        aria-live="polite" 
        role="status"
      >
        <p>
          {currentWord.includes(lastGuess) ? `Correct the ${lastGuess} is in the word !` : `Sorry, the letter ${lastGuess} is not in the word !`}
          You have {attempsLeft} attempts left !
        </p>
        <p>Current word: {currentWord.split('').map(letter => 
          guessedLetters.includes(letter) ? letter + "." : "blank").join(" ")}</p>
      </section>

      <section 
        className="keyBoard"
      >
        {keyBoardElements}
      </section>

      {
        isGameOver && 
        <button 
          className="new-game-button" 
          onClick={newGame}
        >
          New game
        </button>
      }

      {
        isGameWon && 
        <Confetti 
          recycle = {false} 
          numberOfPieces={1000}
        />
      }
    </main>
  );
}
