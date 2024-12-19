import React, { useEffect, useState } from 'react';

export default function App() {
  const [ color, setColor ] = useState({
    red: 0,
    green: 0,
    blue: 0
  });
  const [ userInterval, setUserInterval] = useState(250);
  const [ isRunning, setIsRunning ] = useState(false);
  const [ increment, setIncrement ] = useState({
    red: 0,
    green:0,
    blue: 0
  });
  const [ error, setError ] = useState({
    flag: false,
    msg: ''
  })

  function validateInput(value) { 

    if (!value.match(/^[0-9a-f]{1,2}$/i) && value !== '') {
      setError({
        flag: true,
        msg: 'Please input in hexadecimal'
      })
    } else {
      resetError();
    };
  };

  const resetError = () => setError({ flag: false, msg: '' })

  function handleStart(event) {
    event.preventDefault();
    if (increment.red === 0 && increment.green === 0 && increment.blue === 0) {

      setError({
        flag: true,
        msg: 'Nothing to run here!!!'
      })

      setTimeout(() => resetError(), 2000);

      return;
    }
    setIsRunning(true);
  };

  function handleStop(event) {
    event.preventDefault();
    setIsRunning(false);
    resetError();
  };

  function handleReset() {
    event.preventDefault();
    resetError();
    setUserInterval(250);
    setColor({
      red: 0,
      green: 0,
      blue: 0
    });
    setIncrement({
      red: 0,
      green:0,
      blue: 0
    });
    setError({
      flag: false,
      msg: ''
    });
    setIsRunning(false);
    document.querySelectorAll('input')
      .forEach((input) => {
        input.value = '';
      })
  }

  function restart() {
    event.preventDefault();
    resetError();
    setColor({
      red: 0,
      green: 0,
      blue: 0
    });
    setError({
      flag: false,
      msg: ''
    });
    setIsRunning(true);
    document.querySelectorAll('input')
      .forEach((input) => {
        if (input.name.match(/start$/i)) {
          input.value = '';
        }
      })
  }

  function handleColor(event) {

    const {name, value} = event.target;
    validateInput(value);

    setColor((prevColor) => ({...prevColor, [name]: value === ''? 0 : parseInt(value, 16) }));
  };

  function handleIncrement(event) {
    const {name, value} = event.target;
    validateInput(value);
    setIncrement((prevIncrement) => ({...prevIncrement, [name]: value === ''? 0 : parseInt(value, 16) }));
  };

  function handleInterval(event) {
    setUserInterval(parseInt(parseFloat(event.target.value) * 1000));    
  }  ;

  useEffect(() => {
    if (!isRunning) {return;};

    //Count how many loop to reach max
    let maxLoop = 0;
    ['red', 'blue', 'green'].forEach((value) => {
      const loop = Math.ceil((255 - color[value]) / increment[value])
      maxLoop = (loop > maxLoop && loop !== Infinity )? loop : maxLoop;
    })

    let count = 0;
    
    //Increment based on the interval
    const interval = setInterval(() => {
      setColor((prevColor) => ({
        red: prevColor.red + increment.red,
        green: prevColor.green + increment.green,
        blue: prevColor.blue + increment.blue
      }))

      count++;

      //Stop when max
      if (count > maxLoop) {
        clearInterval(interval)
        setIsRunning(false);
      };
      
    }, userInterval)

    return () => {
      clearInterval(interval);
    }

  },[isRunning]);

  return (
    <section style={{height: '100vh', width: '100vw'}}>
      <div className='text-center text-3xl font-semibold'>Color Cycle</div>
      <div className='mx-20 my-8 border rounded-3xl h-1/4' 
      style={{backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`, transitionProperty: 'background-color', transitionDuration: `${userInterval}ms`}}></div>
      <form className='flex flex-col place-items-center' >
        <div className='flex flex-row my-4'> {/*This is the starting*/}
          <p  className='me-8'>Starting Color (in Hexadecimal) </p>
          { [ 'red', 'green', 'blue' ].map( (color) => {
            return (
              <>
                <label htmlFor={color} className="me-2">{color}: </label>
                <input name={`${color}-start`} 
                className={`border rounded-md border-gray-700 ps-2 w-1/6 me-8 focus:ring focus:ring-blue-400 disabled:bg-slate-400 ${error.flag && 'focus:ring focus:ring-red-600'}`}
                placeholder={`${color} in 0x`} 
                onChange={handleColor}
                disabled={isRunning}></input>
              </>
            )
          } ) }
        </div>
        <div className='flex flex-row my-4'> {/*This is the increment*/}
          <p  className='me-8'>Increment (in Hexadecimal) </p>
          { [ 'red', 'green', 'blue' ].map( (color) => {
            return (
              <>
                <label htmlFor={color} className="me-2">{color}: </label>
                <input name={color} 
                className={`border rounded-md border-gray-700 ps-2 w-1/6 me-8 focus:ring focus:ring-blue-400 disabled:bg-slate-400 ${error.flag && 'focus:ring focus:ring-red-600'}`}
                placeholder={`${color} in 0x`} 
                onChange={handleIncrement}
                disabled={isRunning}></input>
              </>
            )
          } ) }
        </div>
        <div className='flex flex-row my-4'> {/*This is the interval*/}
          <label htmlFor="interval" className="me-8">Interval: </label>
          <input name='interval' type='number'
          className={`border rounded-md border-gray-700 ps-2 me-2 focus:ring focus:ring-blue-400 disabled:bg-slate-400 ${error.flag && 'focus:ring focus:ring-red-600'}`}
          placeholder={`second`} 
          onChange={handleInterval}
          disabled={isRunning}></input>
          <p>s</p>
        </div>
        <div className='flex flex-row my-4'> {/*This are the buttons*/}
          <button type="submit" 
          className={`border rounded-md border-gray-700 px-2 mx-12 bg-gray-200 ${error.flag?'' : 'hover:bg-orange-200'}`} 
          onClick={isRunning? handleStop : handleStart}
          disabled={error.flag}>
            {isRunning? 'Stop' : 'Start'}
          </button>
          <button type="reset" 
          className={`border rounded-md border-gray-700 px-2 mx-12 bg-gray-200 ${isRunning? '' : 'hover:bg-orange-200'}`} 
          onClick={handleReset}>
            Reset All
          </button>
          <button type="reset" 
          className={`border rounded-md border-gray-700 px-2 mx-12 bg-gray-200 ${isRunning? '' : 'hover:bg-orange-200'}`} 
          onClick={restart}>
            Restart
          </button>
        </div>
      </form>
      {error.flag? (
        <>
        <div className='text-center mt-10 text-red-500'>{error.msg}</div>
        </>
      ) : ''}
    </section>
  );
};