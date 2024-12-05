import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTimeLimit, setPunctuation, setNumbers, setCapitalization, selectTypingSettings } from '../../redux/typingSlice';
import axios from 'axios';
import './TypingPage.css';

async function getRandomText() {
  try {
    const response = await axios.get('https://dummyjson.com/quotes/random/10');
    return response.data.map(e => e.quote)
  } catch (error) {
    console.error('Error fetching random text:', error);
    return '';
  }
}

function alternateDiff(source, change) {
  let is_same = true
  let list = []
  let diff_list = []
  if (change == "") {
    diff_list.push(null)
    list.push([source])
  } else {
    diff_list.push(true)
    for (let i = 0; i < source.length; i++) {
      if (i >= change.length) {
        list.push([])
        while (i < source.length) {
          list.at(-1).push(source[i])
          i++
        }
        diff_list.push(null)
        break
      }
      if (source[i] != change[i] && is_same) {
        is_same = false
        diff_list.push(is_same)
        list.push([change[i]])
        continue
      } else if (source[i] == change[i] && !is_same) {
        is_same = true
        diff_list.push(is_same)
        list.push([source[i]])
        continue
      }
      if ((source[i] == change[i]) == is_same) {
        list.at(-1) ? list.at(-1).push(source[i]) : list.push([source[i]])
        // diff_list.push(is_same)
      }
    }
  }
  return [list.map(e => e.join('')), diff_list]
}

window.alternateDiff = alternateDiff

const Cursor = () => {
  return (
    <div className="h-6 w-1 bg-[var(--accent-color)]"></div>
  )
}

function Diff({ source, change }) {
  const [list, diff_list] = alternateDiff(source, change)
  const list_spaced = list.map(e => e.split(' '))
  return (
    <div className="flex flex-wrap gap-0">
      {
        list.map((e, i) => {
          return <React.Fragment key={i}>
            {diff_list[i] == null && <Cursor />}
            {

              list_spaced[i].map(// word:1 word:last has no margin
                (ee, ii) => <div className={'word mx-2 before-diff-' + (ii == 0) + ' after-diff-' + (ii == list_spaced[i].length - 1)} key={ii}>{ee.split('').map((eee, iii) =>
                  <span key={iii} className={diff_list[i] === null ? "text-gray-400" : diff_list[i] ? "text-green-400" : "text-red-400"}>
                    {eee}
                  </span>
                )}
                </div>
              )
            }
          </React.Fragment>
        })
      }

    </div>
  )
}

const TypingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { style } = useSelector((state) => state.command);
  const { timeLimit, punc, num, capitalize } = useSelector(selectTypingSettings);
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [stats, setStats] = useState(null);
  const capitalizeChoices = ["capital", "small", "word", "sentence"];
  const nextCapitalizeChoice = (cp) => {
    const currentIndex = capitalizeChoices.indexOf(cp);
    const nextIndex = (currentIndex + 1) % capitalizeChoices.length;
    return capitalizeChoices[nextIndex]
  };

  const inputRef = React.useRef(null);
  window.source = text
  window.change = input

  const [sampleTexts, setSampleTexts] = useState([
    'The quick brown fox jumps over the lazy dog.',
    'Be different and be yourself.',]);

  useEffect(() => {
    getRandomText()
      .then((randomText) => {
        setSampleTexts(randomText);
      })
      .catch((error) => {
        console.error('Error fetching random text:', error);
      });
  }, []);

  useEffect(() => {
    let select = (sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);

    select = (select.split(' ').filter(e => e).join(' '));
    if (capitalize === "word") {
      select = (select.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    } else if (capitalize === "sentence") {
      select = (select.split('.').map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('.'));
    } else if (capitalize === "capital") {
      select = (select.toUpperCase());
    } else if (capitalize === "small") {
      select = (select.toLowerCase());
    }

    if (!punc) {
      select = (select.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''));
    }
    if (!num) {
      select = (select.replace(/[0-9]/g, ''));
    }
    setText(select);
    setInput('');
    setStartTime(null);
    setIsActive(false);
    setStats(null);
  }, [sampleTexts, capitalize, num, punc]);

  const calculateStats = useCallback(() => {
    const endTime = new Date();
    const timeElapsed = (endTime - startTime) / 1000; // in seconds
    const wordsTyped = input.trim().split(' ').length;
    const wpm = Math.round((wordsTyped / timeElapsed) * 60);
    const correctWords = input.trim().split(' ').filter(
      (word, i) => word === text.split(' ')[i]
    ).length;
    const accuracy = Math.round((correctWords / wordsTyped) * 100);

    return {
      wpm,
      accuracy,
      time: Math.round(timeElapsed),
      rawWpm: Math.round((input.length / 5) / (timeElapsed / 60))
    };
  }, [input, startTime, text]);

  const handleInput = (e) => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(new Date());
    }
    setInput(e.target.value);
    if (e.target.value.length >= text.length) {
      setIsActive(false);
      const stats = calculateStats();
      setStats(stats);
      navigate('/results', { state: { stats } });
    }
  };

  useEffect(() => {
    if (input.length == 0) {
      setIsActive(false);
      setStartTime(null);
    }
  }, [input])

  useEffect(() => {
    const stopper = setInterval(() => {
      const timeleft__ = timeLimit - Math.floor((new Date() - startTime) / 1000)
      if (isActive && timeleft__ <= 0) {
        setIsActive(false);
        const stats = calculateStats();
        setStats(stats);
        navigate('/results', { state: { stats } });
      } else {
        setTimeLeft(timeleft__)
      }
    }, 1000);
    return () => {
      clearInterval(stopper);
    };
  }, [isActive, timeLimit, startTime]);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <div className="typing-page min-h-screen flex flex-col items-center justify-center p-8">
      <div className={`w-full max-w-3xl ${style === 1 ? 'bg-terminal-gray rounded-lg p-6' : ''}`}>
        <div className="flex justify-between mb-4">
          <div className="space-x-4">
            <button
              className={`${timeLimit === 15 ? 'text-red-400' : 'text-gray-500'}`}
              onClick={() => dispatch(setTimeLimit(15))}
            >
              15
            </button>
            <button
              className={`${timeLimit === 30 ? 'text-red-400' : 'text-gray-500'}`}
              onClick={() => dispatch(setTimeLimit(30))}
            >
              30
            </button>
            <button
              className={`${timeLimit === 60 ? 'text-red-400' : 'text-gray-500'}`}
              onClick={() => dispatch(setTimeLimit(60))}
            >
              60
            </button>
            <button
              className={`${timeLimit === 120 ? 'text-red-400' : 'text-gray-500'}`}
              onClick={() => dispatch(setTimeLimit(120))}
            >
              120
            </button>
          </div>
          {isActive && (
            <div className="d-center timer-cont">
              <span className="text-red-400">
                {timeLeft > 0 && timeLeft}
              </span>
              <span className="text-gray-500">s</span>
            </div>
          )}
          <div className="flex space-x-4">
            <button type='button' onClick={() => dispatch(setPunctuation(!punc))} className={punc ? "text-red-400" : "text-gray-500"}>!punc</button>
            <button type='button' onClick={() => dispatch(setNumbers(!num))} className={num ? "text-red-400" : "text-gray-500"}>123num</button>
            <button type='button' onClick={() => dispatch(setCapitalization(nextCapitalizeChoice(capitalize)))} className={"text-red-400 stack d-center"}>
              <span className=''>{capitalize}</span>
              <span className='text-xs text-gray-500'>{nextCapitalizeChoice(capitalize)}</span>
            </button>
          </div>
        </div>

        <div className="bg-terminal-black p-6 rounded-lg mb-4">
          <div className="text-terminal-white text-lg font-mono">
            <Diff source={text} change={input} />
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          className="w-full bg-transparent h-0 p-0 m-0 border-none outline-none text-terminal-white font-mono text-lg"
          placeholder="Start typing..."
          onBlur={(e) => {
           e.target.focus();
          }}
        />
      </div>
    </div>
  );
};

export default TypingPage;
