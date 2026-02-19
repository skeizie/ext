import React from 'react';

export function MiniGame() {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-[3rem] relative bg-[#0a0a0a]">
      <style>{`
        /* The user's exact CSS with updated colors */
        .stack-wrapper {
          position: relative;
          margin: 0 auto;
          width: 100%;
          height: 700px;
          overflow: hidden;
          counter-reset: points;
          background: #0A0A0A;
          border-radius: 2rem;
          font-family: inherit;
        }

        .stack-wrapper .screen {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Sky */
        .stack-wrapper .sky {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .stack-wrapper .sky > div {
          position: absolute;
          inset: 0;
        }

        .stack-wrapper .sky > div::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          display: block;
          height: 1000vh;
          background: transparent;
          animation: sky-anim 240s steps(8, end) infinite forwards paused;
          opacity: 0.5;
        }

        .stack-wrapper .sky > div + div {
          animation: opacity-anim 30s linear infinite forwards paused;
        }

        .stack-wrapper .sky > div + div::before {
          background: transparent;
          animation: sky-anim 240s steps(8, end) -15s infinite forwards paused;
        }

        /* Inputs and Last Label */
        .stack-wrapper input,
        .stack-wrapper .last {
          z-index: 10;
          position: absolute;
          display: none;
          width: 1000px;
          height: 1000px;
          opacity: 0;
          cursor: pointer;
          pointer-events: auto;
          transform: translate(-500px, -500px);
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }

        .stack-wrapper #last {
          display: initial;
          pointer-events: none;
        }

        .stack-wrapper input:checked,
        .stack-wrapper #last:checked {
          display: none !important;
        }

        /* Base */
        .stack-wrapper .base {
          position: relative;
          left: calc(50% - 15vh);
          top: 35vh;
          width: 30vh;
          height: 30vh;
          background-color: #A467FF;
          pointer-events: none;
          transform: rotateX(45deg) rotateZ(45deg);
          transform-style: preserve-3d;
          transition: transform 0.5s ease-in-out;
        }

        /* Base Sides */
        .stack-wrapper .base::before,
        .stack-wrapper .base::after {
          content: "";
          z-index: -1;
          position: absolute;
          display: block;
        }

        .stack-wrapper .base::before {
          right: 0;
          width: 50vh;
          height: 100%;
          background: linear-gradient(to left, #7c3aed, rgba(124, 58, 237, 0));
          transform: rotateY(-90deg);
          transform-origin: right;
        }

        .stack-wrapper .base::after {
          bottom: 0;
          width: 100%;
          height: 50vh;
          background: linear-gradient(to top, #8b5cf6, rgba(139, 92, 246, 0));
          transform: rotateX(90deg);
          transform-origin: bottom;
        }

        /* Containers */
        .stack-wrapper .container {
          position: absolute;
          display: flex;
          transform-style: preserve-3d;
        }

        .stack-wrapper .container.horizontal {
          left: -45vh;
          flex-direction: row;
          width: calc(90vh + 100%);
          height: 100%;
        }

        .stack-wrapper .container.vertical {
          top: -45vh;
          flex-direction: column;
          width: 100%;
          height: calc(90vh + 100%);
        }

        .stack-wrapper .container::before,
        .stack-wrapper .container::after {
          content: "";
        }

        .stack-wrapper .container.horizontal::before,
        .stack-wrapper .container.horizontal::after {
          max-width: calc(100% - 45vh);
          min-width: 45vh;
          height: 100%;
        }

        .stack-wrapper .container.vertical::before,
        .stack-wrapper .container.vertical::after {
          width: 100%;
          max-height: calc(100% - 45vh);
          min-height: 45vh;
        }

        /* Blocks */
        .stack-wrapper .block {
          position: relative;
          visibility: hidden;
          flex-grow: 1;
          background-color: currentColor;
          transform: translateZ(6vh);
          transform-style: preserve-3d;
        }

        .stack-wrapper .block.horizontal {
          height: 100%;
        }

        .stack-wrapper .block.vertical {
          width: 100%;
        }

        .stack-wrapper .block.floating {
          position: absolute;
          display: none;
          visibility: visible;
        }

        .stack-wrapper .block.floating.horizontal {
          width: calc(100% - 90vh);
          animation: left-anim 2s linear alternate infinite both;
        }

        .stack-wrapper .block.floating.vertical {
          height: calc(100% - 90vh);
          animation: top-anim 2s linear alternate infinite both;
        }

        /* Block Sides */
        .stack-wrapper .block::before,
        .stack-wrapper .block::after {
          content: "";
          z-index: -1;
          position: absolute;
          display: block;
          background-color: currentColor;
        }

        .stack-wrapper .block::before {
          right: 0;
          width: 6vh;
          height: 100%;
          box-shadow: inset -6vh 0 rgba(0, 0, 0, 0.2);
          transform: rotateY(-90deg);
          transform-origin: right;
        }

        .stack-wrapper .block::after {
          bottom: 0;
          width: 100%;
          height: 6vh;
          box-shadow: inset 0 -6vh rgba(0, 0, 0, 0.1);
          transform: rotateX(90deg);
          transform-origin: bottom;
        }

        /* End Labels */
        .stack-wrapper .end {
          position: absolute;
          left: -200vh;
          top: -300vh;
          visibility: visible;
          max-width: 400vh;
          max-height: 600vh;
          pointer-events: auto;
          cursor: pointer;
          transform: rotateZ(-45deg) rotateX(-45deg) translateZ(100vh);
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }

        .stack-wrapper .end.horizontal {
          width: calc(400vh - 100000%);
          height: 600vh;
        }

        .stack-wrapper .end.vertical {
          width: 400vh;
          height: calc(600vh - 100000%);
        }

        /* Points */
        .stack-wrapper .points {
          position: absolute;
          inset: 0;
          display: none;
          text-align: center;
          color: white;
          font-size: 9vh;
          font-weight: 900;
          pointer-events: none;
          z-index: 20;
          padding-top: 40px;
        }

        .stack-wrapper .points::before {
          content: "TOP REACHED!";
          display: block;
          margin: 4vh auto;
          font-size: 2vh;
          opacity: 0;
          transition: opacity 0.25s;
          color: #A467FF;
          letter-spacing: 0.3em;
        }

        .stack-wrapper .points::after {
          content: counter(points);
          display: block;
        }

        /* Start Label */
        .stack-wrapper .start {
          position: absolute;
          inset: 0;
          text-align: center;
          color: transparent;
          cursor: pointer;
          transition: opacity 0.25s;
          animation: start-anim 0.75s linear;
          -webkit-user-select: none;
          user-select: none;
          z-index: 100;
        }

        /* Restart Button */
        .stack-wrapper button {
          position: absolute;
          inset: 0;
          border: none;
          padding-top: 80vh;
          width: 100%;
          color: white;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          opacity: 0;
          pointer-events: none;
          font-size: 3vh;
          font-weight: 900;
          font-style: italic;
          cursor: pointer;
          transition: opacity 0.25s;
          z-index: 101;
        }

        /* Keyframes */
        @keyframes opacity-anim {
          0%, 25%, 100% { opacity: 1; }
          50%, 75% { opacity: 0; }
        }
        @keyframes sky-anim {
          from { transform: none; }
          to { transform: translateY(-880vh); }
        }
        @keyframes width-anim {
          from { width: 0; }
          to { width: 90vh; }
        }
        @keyframes height-anim {
          from { height: 0; }
          to { height: 90vh; }
        }
        @keyframes left-anim {
          from { left: 0; }
          to { left: 90vh; }
        }
        @keyframes top-anim {
          from { top: 0; }
          to { top: 90vh; }
        }
        @keyframes color-anim {
          0%, 100% { color: #A467FF; }
          20% { color: #c084fc; }
          40% { color: #8b5cf6; }
          60% { color: #7c3aed; }
          80% { color: #6d28d9; }
        }
        @keyframes start-anim {
          from {
            text-shadow: 0 0 1vh white, 2vh -2vh 1vh white, 2vh 2vh 1vh white,
              -2vh 2vh 1vh white, -2vh -2vh 1vh white;
            opacity: 0;
          }
          to {
            text-shadow: 0 0 0 white;
            opacity: 1;
          }
        }

        /* Game Logic Selectors */
        .stack-wrapper #start:checked ~ .sky > div + div,
        .stack-wrapper #start:checked ~ .sky > div::before {
          animation-play-state: running;
        }

        .stack-wrapper #end:checked ~ .sky > div + div,
        .stack-wrapper #end:checked ~ .sky > div::before,
        .stack-wrapper #last:checked ~ .sky > div + div,
        .stack-wrapper #last:checked ~ .sky > div::before {
          animation-play-state: paused;
        }

        .stack-wrapper #start:checked ~ .base {
          transform: translateY(200vh) rotateX(45deg) rotateZ(45deg);
          transition-duration: 60s;
          transition-timing-function: linear;
        }

        .stack-wrapper #end:checked ~ .base,
        .stack-wrapper #last:checked ~ .base {
          transform: translateY(25vh) rotateX(45deg) rotateZ(45deg) scale3d(0.3, 0.3, 0.3);
          transition-duration: 1s;
          transition-timing-function: ease-in-out;
        }

        .stack-wrapper #start:checked ~ .base > input,
        .stack-wrapper input:checked + .container > .block > input,
        .stack-wrapper input:checked + .container > .block > .last {
          display: block;
        }

        .stack-wrapper #start:checked ~ .base .container {
          animation: color-anim 60s linear alternate infinite both;
        }

        .stack-wrapper #start:checked ~ .base > .container,
        .stack-wrapper input:checked + .container > .block > .container {
          animation-play-state: paused !important;
        }

        .stack-wrapper #start:checked ~ .base > .container.horizontal::before,
        .stack-wrapper input:checked + .container > .block > .container.horizontal::before {
          animation: width-anim 2s linear infinite alternate both running;
        }

        .stack-wrapper #start:checked ~ .base > .container.horizontal::after,
        .stack-wrapper input:checked + .container > .block > .container.horizontal::after {
          animation: width-anim 2s linear infinite alternate-reverse both running;
        }

        .stack-wrapper #start:checked ~ .base > .container.vertical::before,
        .stack-wrapper input:checked + .container > .block > .container.vertical::before {
          animation: height-anim 2s linear infinite alternate both running;
        }

        .stack-wrapper #start:checked ~ .base > .container.vertical::after,
        .stack-wrapper input:checked + .container > .block > .container.vertical::after {
          animation: height-anim 2s linear infinite alternate-reverse both running;
        }

        .stack-wrapper #end:active ~ .base .container::before,
        .stack-wrapper #end:active ~ .base .container::after,
        .stack-wrapper #end:checked ~ .base .container::before,
        .stack-wrapper #end:checked ~ .base .container::after,
        .stack-wrapper #last:active ~ .base .container::before,
        .stack-wrapper #last:active ~ .base .container::after,
        .stack-wrapper #last:checked ~ .base .container::before,
        .stack-wrapper #last:checked ~ .base .container::after,
        .stack-wrapper input:active + .container::before,
        .stack-wrapper input:active + .container::after,
        .stack-wrapper input:checked + .container::before,
        .stack-wrapper input:checked + .container::after {
          animation-play-state: paused !important;
        }

        .stack-wrapper #start:checked ~ .base > .container > .floating,
        .stack-wrapper input:checked + .container > .block > .container > .floating {
          display: block;
        }

        .stack-wrapper #end:active ~ .base .floating,
        .stack-wrapper #last:active ~ .base .floating,
        .stack-wrapper input:active + .container > .floating {
          animation-play-state: paused;
        }

        .stack-wrapper #end:checked ~ .base .floating,
        .stack-wrapper #last:checked ~ .base .floating,
        .stack-wrapper input:checked + .container > .floating {
          visibility: hidden;
          color: transparent;
          transition: color 0.5s, background-color 0.5s, visibility 0s 0.5s;
          animation-play-state: paused;
        }

        .stack-wrapper #last:checked ~ .base .floating,
        .stack-wrapper input:checked + .container > .floating {
          counter-increment: points 1;
        }

        .stack-wrapper #end:checked ~ .base .floating::before,
        .stack-wrapper #end:checked ~ .base .floating::after,
        .stack-wrapper #last:checked ~ .base .floating::before,
        .stack-wrapper #last:checked ~ .base .floating::after,
        .stack-wrapper input:checked + .container > .floating::before,
        .stack-wrapper input:checked + .container > .floating::after {
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.5s, visibility 0s 0.5s;
          animation-play-state: paused;
        }

        .stack-wrapper input:checked + .container > .floating + .block,
        .stack-wrapper #last:checked ~ .base .last + .container > .floating + .block {
          visibility: visible;
        }

        .stack-wrapper .screen:valid .points {
          display: block;
        }

        .stack-wrapper #last:checked ~ .points::before {
          opacity: 1;
        }

        .stack-wrapper #start:checked ~ .start {
          pointer-events: none;
          opacity: 0;
          animation: none;
        }

        .stack-wrapper #end:checked ~ button,
        .stack-wrapper #last:checked ~ button {
          pointer-events: auto;
          opacity: 1;
        }
      `}</style>
      
      <div className="stack-wrapper">
        <form className="screen" noValidate>
          <input id="start" type="checkbox" tabIndex={-1} />
          <input id="end" type="checkbox" tabIndex={-1} />
          <input id="last" type="checkbox" tabIndex={-1} />
          <div className="sky">
            <div></div>
            <div></div>
          </div>
          <div className="base">
            <input type="checkbox" tabIndex={-1} required />
            <div className="container horizontal">
              <div className="block floating horizontal"></div>
              <div className="block horizontal">
                <input type="checkbox" tabIndex={-1} />
                <div className="container vertical">
                  <div className="block floating vertical"></div>
                  <div className="block vertical">
                    <input type="checkbox" tabIndex={-1} />
                    <div className="container horizontal">
                      <div className="block floating horizontal"></div>
                      <div className="block horizontal">
                        <input type="checkbox" tabIndex={-1} />
                        <div className="container vertical">
                          <div className="block floating vertical"></div>
                          <div className="block vertical">
                            <input type="checkbox" tabIndex={-1} />
                            <div className="container horizontal">
                              <div className="block floating horizontal"></div>
                              <div className="block horizontal">
                                <input type="checkbox" tabIndex={-1} />
                                <div className="container vertical">
                                  <div className="block floating vertical"></div>
                                  <div className="block vertical">
                                    <input type="checkbox" tabIndex={-1} />
                                    <div className="container horizontal">
                                      <div className="block floating horizontal"></div>
                                      <div className="block horizontal">
                                        <input type="checkbox" tabIndex={-1} />
                                        <div className="container vertical">
                                          <div className="block floating vertical"></div>
                                          <div className="block vertical">
                                            <input type="checkbox" tabIndex={-1} />
                                            <div className="container horizontal">
                                              <div className="block floating horizontal"></div>
                                              <div className="block horizontal">
                                                <input type="checkbox" tabIndex={-1} />
                                                <div className="container vertical">
                                                  <div className="block floating vertical"></div>
                                                  <div className="block vertical">
                                                    <input type="checkbox" tabIndex={-1} />
                                                    <div className="container horizontal">
                                                      <div className="block floating horizontal"></div>
                                                      <div className="block horizontal">
                                                        <input type="checkbox" tabIndex={-1} />
                                                        <div className="container vertical">
                                                          <div className="block floating vertical"></div>
                                                          <div className="block vertical">
                                                            <input type="checkbox" tabIndex={-1} />
                                                            <div className="container horizontal">
                                                              <div className="block floating horizontal"></div>
                                                              <div className="block horizontal">
                                                                <input type="checkbox" tabIndex={-1} />
                                                                <div className="container vertical">
                                                                  <div className="block floating vertical"></div>
                                                                  <div className="block vertical">
                                                                    <input type="checkbox" tabIndex={-1} />
                                                                    <div className="container horizontal">
                                                                      <div className="block floating horizontal"></div>
                                                                      <div className="block horizontal">
                                                                        <input type="checkbox" tabIndex={-1} />
                                                                        <div className="container vertical">
                                                                          <div className="block floating vertical"></div>
                                                                          <div className="block vertical">
                                                                            <input type="checkbox" tabIndex={-1} />
                                                                            <div className="container horizontal">
                                                                              <div className="block floating horizontal"></div>
                                                                              <div className="block horizontal">
                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                <div className="container vertical">
                                                                                  <div className="block floating vertical"></div>
                                                                                  <div className="block vertical">
                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                    <div className="container horizontal">
                                                                                      <div className="block floating horizontal"></div>
                                                                                      <div className="block horizontal">
                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                        <div className="container vertical">
                                                                                          <div className="block floating vertical"></div>
                                                                                          <div className="block vertical">
                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                            <div className="container horizontal">
                                                                                              <div className="block floating horizontal"></div>
                                                                                              <div className="block horizontal">
                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                <div className="container vertical">
                                                                                                  <div className="block floating vertical"></div>
                                                                                                  <div className="block vertical">
                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                    <div className="container horizontal">
                                                                                                      <div className="block floating horizontal"></div>
                                                                                                      <div className="block horizontal">
                                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                                        <div className="container vertical">
                                                                                                          <div className="block floating vertical"></div>
                                                                                                          <div className="block vertical">
                                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                                            <div className="container horizontal">
                                                                                                              <div className="block floating horizontal"></div>
                                                                                                              <div className="block horizontal">
                                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                                <div className="container vertical">
                                                                                                                  <div className="block floating vertical"></div>
                                                                                                                  <div className="block vertical">
                                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                                    <div className="container horizontal">
                                                                                                                      <div className="block floating horizontal"></div>
                                                                                                                      <div className="block horizontal">
                                                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                                                        <div className="container vertical">
                                                                                                                          <div className="block floating vertical"></div>
                                                                                                                          <div className="block vertical">
                                                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                                                            <div className="container horizontal">
                                                                                                                              <div className="block floating horizontal"></div>
                                                                                                                              <div className="block horizontal">
                                                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                                                <div className="container vertical">
                                                                                                                                  <div className="block floating vertical"></div>
                                                                                                                                  <div className="block vertical">
                                                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                                                    <div className="container horizontal">
                                                                                                                                      <div className="block floating horizontal"></div>
                                                                                                                                      <div className="block horizontal">
                                                                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                                                                        <div className="container vertical">
                                                                                                                                          <div className="block floating vertical"></div>
                                                                                                                                          <div className="block vertical">
                                                                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                                                                            <div className="container horizontal">
                                                                                                                                              <div className="block floating horizontal"></div>
                                                                                                                                              <div className="block horizontal">
                                                                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                                                                <div className="container vertical">
                                                                                                                                                  <div className="block floating vertical"></div>
                                                                                                                                                  <div className="block vertical">
                                                                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                                                                    <div className="container horizontal">
                                                                                                                                                      <div className="block floating horizontal"></div>
                                                                                                                                                      <div className="block horizontal">
                                                                                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                                                                                        <div className="container vertical">
                                                                                                                                                          <div className="block floating vertical"></div>
                                                                                                                                                          <div className="block vertical">
                                                                                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                                                                                            <div className="container horizontal">
                                                                                                                                                              <div className="block floating horizontal"></div>
                                                                                                                                                              <div className="block horizontal">
                                                                                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                <div className="container vertical">
                                                                                                                                                                  <div className="block floating vertical"></div>
                                                                                                                                                                  <div className="block vertical">
                                                                                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                    <div className="container horizontal">
                                                                                                                                                                      <div className="block floating horizontal"></div>
                                                                                                                                                                      <div className="block horizontal">
                                                                                                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                        <div className="container vertical">
                                                                                                                                                                          <div className="block floating vertical"></div>
                                                                                                                                                                          <div className="block vertical">
                                                                                                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                            <div className="container horizontal">
                                                                                                                                                                              <div className="block floating horizontal"></div>
                                                                                                                                                                              <div className="block horizontal">
                                                                                                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                                <div className="container vertical">
                                                                                                                                                                                  <div className="block floating vertical"></div>
                                                                                                                                                                                  <div className="block vertical">
                                                                                                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                                    <div className="container horizontal">
                                                                                                                                                                                      <div className="block floating horizontal"></div>
                                                                                                                                                                                      <div className="block horizontal">
                                                                                                                                                                                        <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                                        <div className="container vertical">
                                                                                                                                                                                          <div className="block floating vertical"></div>
                                                                                                                                                                                          <div className="block vertical">
                                                                                                                                                                                            <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                                            <div className="container horizontal">
                                                                                                                                                                                              <div className="block floating horizontal"></div>
                                                                                                                                                                                              <div className="block horizontal">
                                                                                                                                                                                                <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                                                <div className="container vertical">
                                                                                                                                                                                                  <div className="block floating vertical"></div>
                                                                                                                                                                                                  <div className="block vertical">
                                                                                                                                                                                                    <input type="checkbox" tabIndex={-1} />
                                                                                                                                                                                                    <div className="container horizontal">
                                                                                                                                                                                                      <div className="block floating horizontal"></div>
                                                                                                                                                                                                      <div className="block horizontal">
                                                                                                                                                                                                        <label className="last" htmlFor="last" tabIndex={-1}></label>
                                                                                                                                                                                                        <div className="container vertical">
                                                                                                                                                                                                          <div className="block floating vertical"></div>
                                                                                                                                                                                                          <div className="block vertical">
                                                                                                                                                                                                            <label className="end horizontal" htmlFor="end"></label>
                                                                                                                                                                                                            <label className="end vertical" htmlFor="end"></label>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                      </div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                  </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                              </div>
                                                                                                                                                                                            </div>
                                                                                                                                                                                          </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                      </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                                  </div>
                                                                                                                                                                                </div>
                                                                                                                                                                              </div>
                                                                                                                                                                            </div>
                                                                                                                                                                          </div>
                                                                                                                                                                        </div>
                                                                                                                                                                      </div>
                                                                                                                                                                    </div>
                                                                                                                                                                  </div>
                                                                                                                                                                </div>
                                                                                                                                                              </div>
                                                                                                                                                            </div>
                                                                                                                                                          </div>
                                                                                                                                                        </div>
                                                                                                                                                      </div>
                                                                                                                                                    </div>
                                                                                                                                                  </div>
                                                                                                                                                </div>
                                                                                                                                              </div>
                                                                                                                                            </div>
                                                                                                                                          </div>
                                                                                                                                        </div>
                                                                                                                                      </div>
                                                                                                                                    </div>
                                                                                                                                  </div>
                                                                                                                                </div>
                                                                                                                              </div>
                                                                                                                            </div>
                                                                                                                          </div>
                                                                                                                        </div>
                                                                                                                      </div>
                                                                                                                    </div>
                                                                                                                  </div>
                                                                                                                </div>
                                                                                                              </div>
                                                                                                            </div>
                                                                                                          </div>
                                                                                                        </div>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </div>
                                                                                              </div>
                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                      </div>
                                                                                    </div>
                                                                                  </div>
                                                                                </div>
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="points"></div>
          <label className="start" htmlFor="start" tabIndex={-1}>
          </label>
          <button 
            type="reset" 
            tabIndex={-1}
            className="cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-10 py-6 text-white font-black tracking-widest transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(164,103,255,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] uppercase"
          >
            CLICK OR TAP<br />
            TO RESTART
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center space-x-3 opacity-40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#A467FF] animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Precision timing required</span>
      </div>
    </div>
  );
}
