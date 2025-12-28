import style from "./style.module.css";
import React from "react";
import { Countdown as CountdownController } from "./Countdown";

export default class CountdownComponent extends React.Component {
  state = {
    isReset: false,
  };

  componentDidMount() {
    if (!this.controller) {
      this.controller = new CountdownController(
        style,
        this.countdownContainer,
        this.state.isReset
      );
      this.controller.reset(this.state.isReset);
      this.controller.init();
    }
  }

  shouldComponentUpdate() {
    return !this.controller.isReset;
  }

  componentWillUnmount() {
    this.setState({
      isReset: true,
    });
    //   this.controller.reset(this.state.isReset);
  }

  render() {
    return (
      <div
        className={style.countdownContainer}
        ref={(div) => (this.countdownContainer = div)}
      >
        <div
          className={`${style.countdown}`}
          aria-hidden="true"
          role="presentation"
        >
          <div className={`${style.unitWrapper}`}>
            <div
              className={`${style.digit} js-digit`}
              data-unit="days"
              data-max-number="nine"
            />
            <div
              className={`${style.digit} js-digit`}
              data-unit="days"
              data-max-number="nine"
            />
            <span className={`${style.unitLabel}`}>D</span>
          </div>
          <div className={`${style.unitWrapper}`}>
            <div
              className={`${style.digit} js-digit`}
              data-unit="hours"
              data-max-number="two"
            />
            <div
              className={`${style.digit} js-digit`}
              data-unit="hours"
              data-max-number="nine"
            />
            <span className={`${style.unitLabel}`}>H</span>
          </div>
          <div className={`${style.unitWrapper}`}>
            <div
              className={`${style.digit} js-digit`}
              data-unit="minutes"
              data-max-number="five"
            />
            <div
              className={`${style.digit} js-digit`}
              data-unit="minutes"
              data-max-number="nine"
            />
            <span className={`${style.unitLabel}`}>M</span>
          </div>
          <div className={`${style.unitWrapper}`}>
            <div
              className={`${style.digit} js-digit`}
              data-unit="seconds"
              data-max-number="five"
            />
            <div
              className={`${style.digit} js-digit`}
              data-unit="seconds"
              data-max-number="nine"
            />
            <span className={`${style.unitLabel}`}>S</span>
          </div>
        </div>
      </div>
    );
  }
}
