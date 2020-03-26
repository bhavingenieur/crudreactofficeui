import React, { Component } from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { DefaultButton } from 'office-ui-fabric-react';
import { IStackTokens, Stack } from 'office-ui-fabric-react/lib/Stack';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';

const controlClass = mergeStyleSets({
    control: {
      margin: '0 0 15px 0',
      maxWidth: '300px'
    }
  });
const numericalSpacingStackTokens = {
  childrenGap: 10,
  padding: 10
}

export default class ScheduleEditor extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstDayOfWeek: DayOfWeek.Sunday,
            dt:'',
            tm:''
          };
    }
     _onDropdownChange = (event, option) => {
    this.setState({
      firstDayOfWeek: (DayOfWeek)[option.key]
    });
     };
    _sendDate = (event)=>{
      let newprop = moment(event).format("dddd, MMMM Do YYYY")
      this.state.dt = newprop;
    }
    _setTime = (event) => {
        let pop = moment(event.target.innerText, "hh:mm a")
        pop = pop.toISOString();
        this.setState({ tm : pop})
    }
    _postdata = () => {
        this.props.auth_svc.getUser().then( res=>{
            this.setState({ mail : res.email})
            console.log(this.state.tm)
              if(this.state.dt && this.state.tm) {
                const payload = { email: this.state.mail, dt : this.state.dt, tm : this.state.tm}
                axios.post(`http://localhost:5000/api/postdata`, {payload})
                    .then(() => console.log('updated'))
                }
        })        
    }

    render(){
        const dropdownStyles = {
            dropdown: { width: 300 }
          };
        const options = [
            {key: 'morning', 'text': 'Morning', itemType: DropdownMenuItemType.Header},
            { key: '07:00', text: '07:00 AM' },
            { key: '08:00', text: '08:00 AM' },
            { key: '09:00', text: '09:00 AM' },
            { key: '10:00', text: '10:00 AM' },
            { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
            {key: 'evening', 'text': 'Evening', itemType: DropdownMenuItemType.Header},
            { key: '16:00', text: '04:00 PM' },
            { key: '17:00', text: '05:00 PM' },
            { key: '18:00', text: '06:00 PM' },
            { key: '19:00', text: '07:00 PM' },
        ]
        const DayPickerStrings = {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          
            shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          
            goToToday: 'Go to today',
            prevMonthAriaLabel: 'Go to previous month',
            nextMonthAriaLabel: 'Go to next month',
            prevYearAriaLabel: 'Go to previous year',
            nextYearAriaLabel: 'Go to next year',
            closeButtonAriaLabel: 'Close date picker'
          };

          const { firstDayOfWeek } = this.state;
        return (
        <Stack tokens={numericalSpacingStackTokens}>
        <DatePicker
          className={controlClass.control}
          firstDayOfWeek={firstDayOfWeek}
          label = 'Choose your date'
          strings={DayPickerStrings}
          placeholder="Select a date..."
          ariaLabel="Select a date"
          onSelectDate={this._sendDate}
        />
        <Dropdown
          className={controlClass.control}
          label="Select the first day of the week"
          options={[
            {
              text: 'Sunday',
              key: DayOfWeek[DayOfWeek.Sunday]
            },
            {
              text: 'Monday',
              key: DayOfWeek[DayOfWeek.Monday]
            },
            {
              text: 'Tuesday',
              key: DayOfWeek[DayOfWeek.Tuesday]
            },
            {
              text: 'Wednesday',
              key: DayOfWeek[DayOfWeek.Wednesday]
            },
            {
              text: 'Thursday',
              key: DayOfWeek[DayOfWeek.Thursday]
            },
            {
              text: 'Friday',
              key: DayOfWeek[DayOfWeek.Friday]
            },
            {
              text: 'Saturday',
              key: DayOfWeek[DayOfWeek.Saturday]
            }
          ]}
          selectedKey={DayOfWeek[firstDayOfWeek]}
          onChange={this._onDropdownChange}
        />
        <Dropdown placeholder="Select an option" onChange= {this._setTime}label="Pick your time" options={options} styles={dropdownStyles} />
        <DefaultButton className={controlClass.control} text="Add to Schedule" onClick={this._postdata} />
        </Stack>
        )
    }
}