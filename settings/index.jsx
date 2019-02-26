function mySettings(props) {
  return (
    <Page>
               
      <Section title={<Text bold align="center">Time Zone Settings</Text>}>
      <Text italic>    
        The main Time Zone settings can also be set by double tapping in the top right hand corner of the fitbit screen.
      </Text>  
        <Toggle
          settingsKey="secondTimeZone"
          label="Show Second Time Zone"
        />
      <Text italic>
        Press the steps icon in the lower left of the screen to switch time zones.  
      </Text>
        <Select
          label={`Select Time Zone`}
          settingsKey="TimeZone"
          selectViewTitle="Offset from UTC (hours)"
          disabled={!(props.settings.secondTimeZone === "true")}
          options={[
            {TZ:"-11", name:"Samoa", value:"-11"},
            {TZ:"-10", name:"Hawaii", value:"-10"},
            {TZ:"-9:30", name:"Marquesas Islands", value:"-9.5"},            
            {TZ:"-9", name:"Alaska", value:"-9"},
            {TZ:"-8", name:"Pacific", value:"-8"},
            {TZ:"-7", name:"Mountain", value:"-7"},
            {TZ:"-6", name:"Central", value:"-6"},
            {TZ:"-5", name:"Eastern", value:"-5"},
            {TZ:"-4", name:"Santiago", value:"-4"},
            {TZ:"-3:30", name:"Newfoundland", value:"-3.5"},            
            {TZ:"-3", name:"Buenos Aires", value:"-3"},
            {TZ:"-2", name:"Mid-Atlantic", value:"-2"},
            {TZ:"-1", name:"Azores", value:"-1"},
            {TZ:"0", name:"GMT", value:"0"},
            {TZ:"1", name:"Central European", value:"1"},
            {TZ:"2", name:"Eastern European", value:"2"},
            {TZ:"3", name:"Moscow", value:"3"},
            {TZ:"3:30", name:"Iran", value:"3.5"},
            {TZ:"4", name:"Seychelles", value:"4"},
            {TZ:"4:30", name:"Afghanistan", value:"4.5"},
            {TZ:"5", name:"Pakistan", value:"5"},
            {TZ:"5:30", name:"India", value:"5.5"},
            {TZ:"5:45", name:"Nepal", value:"5.75"},
            {TZ:"6", name:"Bangladesh", value:"6"},
            {TZ:"6:30", name:"Cocos Islands", value:"6.5"},
            {TZ:"7", name:"Thailand", value:"7"},
            {TZ:"8", name:"China", value:"8"},
            {TZ:"9", name:"Japan", value:"9"},
            {TZ:"9:30", name:"Australian Central", value:"9.5"},
            {TZ:"10", name:"Australian Eastern", value:"10"},
            {TZ:"11", name:"Solomon Islands", value:"11"},
            {TZ:"12", name:"New Zealand", value:"12"},
          ]}
          renderItem={
            (option) =>
              <TextImageRow
                label={option.name}
                sublabel={option.TZ}
              />
          }
        /> 


        <Toggle
          settingsKey="DST"
          label="Daylight Savings"
        />


        <Toggle
          settingsKey="TZtoggle"
          label="Sticky Time Zone"
        />
        
      <Text italic>
          When on, the selected time zone will remain visible.  Otherwise the clock will revert to local time after 20 seconds. 
      </Text>
      </Section> 
      
      <Section>
        <Slider
          label="Time Zone button opacity %"
          settingsKey="slider"
          step="10"
          min="0"
          max="100"
        />
        <Text italic>
            Adjust the opacity of the of the outline of the time zone button.  Set to zero to hide.
        </Text>

      </Section> 

      <Section title={<Text bold align="center">General Settings</Text>}>
        <Text> Home hours colour </Text>
        <ColorSelect
          centered={true}
          settingsKey="hoursColorVal"
          colors={[
            {color: '#FFCC33',       value: '0'},
            {color: '#FC6B3A',       value: '1'},
            {color: 'deeppink',      value: '2'},
            {color: 'greenyellow',   value: '3'},
            {color: 'lightseagreen', value: '4'},
            {color: '#14D3F5',       value: '5'},
            {color: '#3182DE',       value: '6'},
            {color: 'steelblue',     value: '7'},
            {color: '#505050',       value: '8'},
            {color: '#A0A0A0',       value: '9'},
            {color: '#FFFFFF',       value: '10'}
         ]}
          onSelection={(hoursColorVal) => console.log(hoursColorVal)}
        />
      </Section>
      
      <Section>
        <Text> Second Time Zone hours colour </Text>
        <ColorSelect
          centered={true}
          settingsKey="TZhoursColorVal"
          colors={[
            {color: 'deeppink',      value: '2'},
            {color: '#FFCC33',       value: '0'},
            {color: '#FC6B3A',       value: '1'},
            {color: 'greenyellow',   value: '3'},
            {color: 'lightseagreen', value: '4'},
            {color: '#14D3F5',       value: '5'},
            {color: '#3182DE',       value: '6'},
            {color: 'steelblue',     value: '7'},
            {color: '#505050',       value: '8'},
            {color: '#A0A0A0',       value: '9'},
            {color: '#FFFFFF',       value: '10'}
         ]}
          onSelection={(TZhoursColorVal) => console.log(TZhoursColorVal)}
        />
      </Section>
      
      <Section>
        <Slider
          label="Activity progress bar opacity"
          settingsKey="Activity-slider"
          step="10"
          min="0"
          max="50"
        />
        <Text italic>
          Adjust the opacity of the progress bars on the activity screen.  Set to zero to remove the progress bars.
        </Text>
      </Section>
      
      <Section>
        <Text>CLARITY v3 by Ade Russell </Text>

        <Text>This clock face is free.  If you like it and use it, please consider buying me a coffee by 
              making a donation to aderussell@me.com via PayPal. </Text>
     
      </Section>       
    </Page>
  );
}

registerSettingsPage(mySettings);
