import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width;
    }

    componentDidMount() {
        this.initialiseEvents();
    }

    state = {
        selectedMonth: moment(),
        selectedDay: moment().startOf("day"),
        showing: false,
        showCurrentWeek: false,
        selectedMonthEvents: [],
        showEvents: false
    };

    weekdaysShort = ["S", "M", "T", "W", "T", "F", "S"];

    month = () => {
        return this.state.selectedMonth.format("MMMM");
    };

    MonthNav = () => {
        let saturday = this.state.selectedMonth.clone().weekday(0).format("D");
        let sunday = this.state.selectedMonth.clone().weekday(6).format("D");
        return (
            <span className={this.state.showCurrentWeek ? "label-month-week" : "label-month"}>
                {this.state.showCurrentWeek ? this.month() + " " + saturday + "-" + sunday : this.month()}
            </span>
        );
    };

    select(day) {
        this.setState({
            selectedMonth: day.date,
            selectedDay: day.date.clone(),
            showEvents: true
        });
    }

    renderWeeks() {
        const currentMonthView = this.state.selectedMonth;
        const currentSelectedDay = this.state.selectedDay;
        const monthEvents = this.state.selectedMonthEvents;
        const showCurrentWeek = this.state.showCurrentWeek;

        let weeks = [];
        let done = false;
        let monthView = currentMonthView
            .clone()
            .startOf("month")
            .subtract(1, "d")
            .day("Sunday");
        let weekView = currentMonthView.clone().startOf("week");
        let count = 0;
        let monthIndex = monthView.month();
        if (!showCurrentWeek) {
            while (!done) {
                weeks.push(
                    <Week
                        previousCurrentNextView={monthView.clone()}
                        currentMonthView={currentMonthView}
                        monthEvents={monthEvents}
                        showCurrentWeek={showCurrentWeek}
                        selected={currentSelectedDay}
                        select={day => this.select(day)}
                    />
                );
                monthView.add(1, "w");
                done = count++ > 2 && monthIndex !== monthView.month();
                monthIndex = monthView.month();
            }
        } else if (showCurrentWeek) {
            while (!done) {
                weeks.push(
                    <Week
                        previousCurrentNextView={weekView.clone()}
                        currentMonthView={currentMonthView}
                        monthEvents={monthEvents}
                        showCurrentWeek={showCurrentWeek}
                        selected={currentSelectedDay}
                        select={day => this.select(day)}
                    />
                );
                weekView.add(1, "w");
                done = count++ < 2;

            }
        }
        return weeks;

    }

    initialiseEvents() {
        const monthEvents = this.state.selectedMonthEvents;

        let allEvents = [];

        let event1 = {
            title: "Event 1 - Meeting",
            date: moment("04/10/2019", 'MM/DD/YYYY').add(10, "h"),
            body: "event body"
        };

        let event2 = {
            title: "Event 2 - Meeting",
            date: moment("04/15/2019", 'MM/DD/YYYY').add(12, "h"),
            body: "event body"
        };

        let event3 = {
            title: "Event 3 - Cinema",
            date: moment("04/23/2019", 'MM/DD/YYYY').add(17, "h"),
            body: "event body"
        };

        let event4 = {
            title: "Event 4 - Theater",
            date: moment("04/23/2019", 'MM/DD/YYYY').add(20, "h"),
            body: "event body"
        };

        let event5 = {
            title: "Event 5 - Drinks",
            date: moment("04/23/2019", 'MM/DD/YYYY').add(12, "h"),
            body: "event body"
        };

        let event6 = {
            title: "Event 6 - Diving",
            date: moment("04/29/2019", 'MM/DD/YYYY').add(13, "h"),
            body: "event body"
        };

        let event7 = {
            title: "Event 7 - Tennis",
            date: moment("04/29/2019", 'MM/DD/YYYY').add(14, "h"),
            body: "event body"
        };

        let event8 = {
            title: "Event 8 - Swimming",
            date: moment("05/14/2019", 'MM/DD/YYYY').add(17, "h"),
            body: "event body"
        };

        let event9 = {
            title: "Event 9 - Chilling",
            date: moment("05/22/2019", 'MM/DD/YYYY').add(16, "h"),
            body: "event body"
        };

        let event10 = {
            title: "Event 10 - Riding",
            date: moment("06/10/2019", 'MM/DD/YYYY').add(8, "h"),
            body: "event body"
        };

        allEvents.push(event1);
        allEvents.push(event2);
        allEvents.push(event3);
        allEvents.push(event4);
        allEvents.push(event5);
        allEvents.push(event6);
        allEvents.push(event7);
        allEvents.push(event8);
        allEvents.push(event9);
        allEvents.push(event10);

        allEvents.sort(function compare(a, b) {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            return dateA - dateB;
        });

        for (let i = 0; i < allEvents.length; i++) {
            monthEvents.push(allEvents[i]);
        }

        this.setState({
            selectedMonthEvents: monthEvents
        });

    }

    render() {
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        const {showing} = this.state;
        const previous = this.state.selectedMonth.clone().subtract(1, "month").format('MMM');
        const next = this.state.selectedMonth.clone().add(1, "month").format('MMM');
        return (
            <div className="calendar-container" style={this.style}>
                <div className="calendar-header">
                    {this.state.showCurrentWeek &&
                    <span className="prev" onClick={(e) => {
                        this.setState({
                            selectedMonth: this.state.selectedMonth.subtract(1, "week")
                        });
                    }}>Prev</span>
                    }
                    {!this.state.showCurrentWeek &&
                    <span className="prev" onClick={(e) => {
                        this.setState({
                            selectedMonth: this.state.selectedMonth.subtract(1, "month")
                        });
                    }}>{previous}</span>
                    }
                    <span className="current-month">
                        {this.MonthNav()}
                    </span>
                    {this.state.showCurrentWeek &&
                    <span className="next" onClick={(e) => {
                        this.setState({
                            selectedMonth: this.state.selectedMonth.add(1, "week")
                        });
                    }}>Next</span>
                    }
                    {!this.state.showCurrentWeek &&
                    <span className="next" onClick={(e) => {
                        this.setState({
                            selectedMonth: this.state.selectedMonth.add(1, "month")
                        });
                    }}>{next}</span>
                    }
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
                <div>
                    <table className="calendar">
                        <thead>
                        <tr>
                            {weekdays}
                        </tr>
                        </thead>
                    </table>
                    {this.renderWeeks()}
                </div>
                {this.state.showEvents &&
                <Events
                    selectedDay={this.state.selectedDay}
                    selectedMonthEvents={this.state.selectedMonthEvents}
                />
                }
            </div>
        );
    }
};

class Events extends React.Component {
    render() {
        const currentSelectedDay = this.props.selectedDay;
        const monthEvents = this.props.selectedMonthEvents;

        const monthEventsRendered = monthEvents.map((event) => {
            return (
                <div className="events">
                    <div className="event-date">{event.date.format("dddd, D MMMM")}
                    </div>
                    <div key={event.title} className="event-container">
                        <div className="event-title">{event.title}</div>

                        <div className="event-time">
                            {event.date.format("HH:mm")}
                        </div>
                        <div className="event-body">
                            {event.body}
                        </div>
                    </div>
                </div>
            );
        });

        let dayEventsRendered = [];
        for (let i = 0; i < monthEventsRendered.length; i++) {
            if (monthEvents[i].date.isSameOrAfter(currentSelectedDay, "day")) {
                dayEventsRendered.push(monthEventsRendered[i]);
            }
        }
        return (
            <div className="day-events">
                {dayEventsRendered}
            </div>
        );
    }
}

class Week extends React.Component {
    render() {
        let days = [];
        let date = this.props.previousCurrentNextView;
        let currentMonthView = this.props.currentMonthView;
        let selected = this.props.selected;
        let select = this.props.select;
        let monthEvents = this.props.monthEvents;
        let showCurrentWeek = this.props.showCurrentWeek;
        let count = 0;

        for (let i = 0; i < 7; i++) {
            let dayHasEvents = false;

            for (let j = 0; j < monthEvents.length; j++) {
                if (monthEvents[j].date.isSame(date, "day")) {
                    dayHasEvents = true;
                    count++;
                }
            }

            let day = {
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === currentMonthView.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                hasEvents: dayHasEvents,
                isWeekend: date.format("dddd") === "Saturday" || date.format("dddd") === "Sunday"
            };
            days.push(<Day day={day} selected={selected} count={count} select={select} showCurrentWeek={showCurrentWeek}
                           monthEvents={monthEvents}/>);
            date = date.clone();
            date.add(1, "d");
        }
        return (
            <div className="row week">
                {days}
            </div>
        );
    }
}

class Day extends React.Component {
    render() {
        let day = this.props.day;
        let selected = this.props.selected;
        let select = this.props.select;
        let showCurrentWeek = this.props.showCurrentWeek;
        let monthEvents = this.props.monthEvents;
        let count = this.props.count;

        const Line = ({color, position}) => (
            <div>
                <span
                    style={{
                        content: "",
                        width: 26,
                        position: position,
                        height: 3,
                        background: color,
                        borderRadius: 6,
                        marginTop: 35,
                        marginLeft: -4
                    }}
                />
            </div>
        );
        const DoubleLine = ({color, position, dposition}) => (
            <div style={{position: dposition}}>
                <span
                    style={{
                        content: "",
                        width: 10,
                        position: position,
                        height: 3,
                        background: color,
                        borderRadius: 6,
                        marginTop: 35,
                        left: -3
                    }}
                />
                <span
                    style={{
                        content: "",
                        width: 10,
                        position: position,
                        height: 3,
                        background: color,
                        borderRadius: 6,
                        marginTop: 35,
                        marginLeft: 10
                    }}
                />
            </div>
        );
        const TripleLine = ({color, position, dposition}) => (
            <div style={{position: dposition}}>
                <span
                    style={{
                        content: "",
                        width: 7,
                        position: position,
                        height: 3,
                        background: color,
                        borderRadius: 6,
                        marginTop: 35,
                        left: -5
                    }}
                />
                <span
                    style={{
                        content: "",
                        width: 7,
                        position: position,
                        height: 3,
                        background: color,
                        borderRadius: 6,
                        marginTop: 35,
                        marginLeft: 5
                    }}
                />
                <span
                    style={{
                        content: "",
                        width: 7,
                        position: position,
                        height: 3,
                        background: color,
                        borderRadius: 6,
                        marginTop: 35,
                        marginLeft: 15
                    }}
                />
            </div>
        );
        return (
            <div
                className={
                    "day" +
                    (day.isCurrentMonth && !showCurrentWeek ? "" : " different-month") +
                    (!day.isCurrentMonth && !showCurrentWeek ? "" : " diff-month") +
                    (day.date.isSame(selected) ? " selected" : " ") +
                    (day.isWeekend ? "day weekend" : "") +
                    (day.isToday ? "day current-day" : "") +
                    (day.isToday && day.isWeekend ? "day current-day weekend" : "") +
                    (day.isWeekend && day.date.isSame(selected) ? "day weekend selected" : "") +
                    (day.isToday && day.date.isSame(selected) ? "day current-day selected" : "")
                }
                onClick={() => select(day)}
            >
                {monthEvents.map((value, index) => {
                    let s = day.date.isSame(monthEvents[index].date, "day");
                    if (count === 1 && s) {
                        return <Line color="#48C1C2" position="absolute"/>;
                    } else if (count === 2 && s) {
                        return <DoubleLine color="#48C1C2" position="absolute" dposition="relative"/>;
                    } else if (count === 3 && s) {
                        return <TripleLine color="#48C1C2" position="absolute" dposition="relative"/>;
                    } else if (count > 3 && s) {
                        return <Line color="#48C1C2" position="absolute"/>;
                    }
                })}
                <div className="day-number">{day.number}</div>
            </div>
        );
    }
}