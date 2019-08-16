import React from 'react';
import moment from 'moment';
import './main.css';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width;
    }

    state = {
        dateContext: moment(),
        today: moment(),
        selectedDay: null,
        showing: false,
        showCurrentWeek: false
    };
    weekdaysShort = moment.weekdaysMin(); // ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    month = () => {
        return this.state.dateContext.format("MMMM");
    };
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    };

    currentDay = () => {
        return this.state.dateContext.format("D");
    };

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        // Day of week 0...1..5...6
        return moment(dateContext).startOf('month').format('d');
    };

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    };

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    };
    MonthNav = () => {
        var saturday = moment().clone().weekday(0).format("D");
        var sunday = moment().clone().weekday(6).format("D");
        return (
            <span className={this.state.showCurrentWeek ? "label-month-week" : "label-month"}>
                {this.state.showCurrentWeek ? this.month() + " " + saturday + "-" + sunday : this.month()}
            </span>
        );
    };

    isWeekend = (d) => {
        const weekday = moment(d, "D").format('dddd'); // Monday ... Sunday
        return weekday === "Sunday" || weekday === "Saturday";

    };
    onDayClick = (e, day) => {
        this.setState({
            selectedDay: day
        }, () => {
            console.log("SELECTED DAY: ", this.state.selectedDay);
        });

        this.props.onDayClick && this.props.onDayClick(e, day);
    };

    render() {
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                    {""}
                </td>
            );
        }

        let daysInMonth = [];

        for (let d = 1; d <= this.daysInMonth(); d++) {
            let currentDay = (d == this.currentDay() ? "day current-day" : "day");
            let selectedDay = (d == this.state.selectedDay ? " selected-day " : "");
            daysInMonth.push(
                <td key={d} className={currentDay + selectedDay}>
                    <span onClick={(e) => {
                        this.onDayClick(e, d)
                    }}>{d}</span>
                </td>
            );
        }
        console.log("days: ", daysInMonth);

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row); // if index not equal 7 that means not go to next week
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);// when reach next week we contain all td in last week to rows
                cells = [];
                cells.push(row); // in current loop we still push current row to new container
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);// when end loop we add remain date
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i * 100}>
                    {d}
                </tr>
            );
        });

        var days = [];
        var currentDate = moment();
        var weekStart = currentDate.clone().startOf('week');
        for (var i = 0; i <= 6; i++) {
            days.push(moment(weekStart).add(i, 'days').format("D"));
        }

        let currentWeek = days.map((week_day) => {
            return (
                <td key={week_day}
                    className={this.isWeekend(week_day) ? "current-week weekend" : "current-week"}>{week_day}</td>
            );
        });

        const {showing} = this.state;

        return (
            <div className="calendar-container" style={this.style}>
                <div className="calendar-header">
                    <span className="prev" onClick={(e) => {
                        this.prevMonth()
                    }}>Prev</span>
                    <span className="current-month">
                        {this.MonthNav()}
                    </span>
                    <span>
                        <span className="next" onClick={(e) => {
                            this.nextMonth()
                        }}>Next</span>
                    </span>
                    <span>
                        <span className={this.state.showing ? "arrow clicked" : "arrow"}
                              onClick={() => this.setState({showing: !showing})}/>
                        {showing ?
                            <div className="block">
                                <span className="thisWeek" onClick={() => this.setState({showCurrentWeek: true})}>This week</span>
                                <span className="thisMonth" onClick={() => this.setState({showCurrentWeek: false})}>This month</span>
                            </div>
                            : null
                        }
                    </span>
                </div>
                {this.state.showCurrentWeek &&
                <table className="calendar">
                    <thead>
                    <tr>
                        {weekdays}
                    </tr>
                    </thead>
                    <tbody>
                    {currentWeek}
                    </tbody>
                </table>
                }
                {!this.state.showCurrentWeek &&
                <table className="calendar">
                    <thead>
                    <tr>
                        {weekdays}
                    </tr>
                    </thead>
                    <tbody>
                    {trElems}
                    </tbody>
                </table>
                }
            </div>

        );

    }
};