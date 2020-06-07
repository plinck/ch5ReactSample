import React from 'react';
import ButtonCH from '../common/buttons/ButtonCH';
import ContinuousSliderCH from '../common/sliders/ContinuousSliderCH';
import TextFieldCH from '../common/strings/TextFieldCH';

class Dashboard extends React.Component {
  public render() {
    return (
        <div>
            <div>Interlock:
                <ButtonCH publishSignalName="21" subscribeSignalName="21" >A-21</ButtonCH>
                <ButtonCH publishSignalName="22" subscribeSignalName="22" >B-22</ButtonCH>
                <ButtonCH publishSignalName="23" subscribeSignalName="23" >C-23</ButtonCH>
                <ButtonCH publishSignalName="24" subscribeSignalName="24" >D-24</ButtonCH>
                <TextFieldCH publishSignalName="21" subscribeSignalName="21" />
            </div>
            <div>Toggle:
                <ButtonCH publishSignalName="31" subscribeSignalName="31" >31</ButtonCH>
                <ButtonCH publishSignalName="32" subscribeSignalName="32" >32</ButtonCH>
            </div>
            <TextFieldCH 
                label="Text Field"
                placeholder="Field Value"
                variant="outlined"
                autoComplete="text"
                margin="normal"    
                inputProps={{style: { padding: 18 }}}
                style={{height: '8rem'}}
                publishSignalName="5"
                subscribeSignalName="5" >
            </TextFieldCH>
            <TextFieldCH 
                label="Text Field"
                placeholder="Field Value"
                variant="outlined"
                autoComplete="text"
                margin="normal"    
                inputProps={{style: { padding: 18 }}}
                style={{height: '8rem'}}
                publishSignalName="1"
                subscribeSignalName="1" >
            </TextFieldCH>
            <TextFieldCH 
                label="Text Field"
                placeholder="Field Value"
                variant="outlined"
                autoComplete="text"
                margin="normal"    
                inputProps={{style: { padding: 18 }}}
                style={{height: '8rem'}}
                publishSignalName="2"
                subscribeSignalName="2" >
            </TextFieldCH>
            <TextFieldCH 
                label="Text Field"
                placeholder="Field Value"
                variant="outlined"
                autoComplete="text"
                margin="normal"    
                inputProps={{style: { padding: 18 }}}
                style={{height: '8rem'}}
                publishSignalName="3"
                subscribeSignalName="3" >
            </TextFieldCH>
            <TextFieldCH 
                label="Text Field"
                placeholder="Field Value"
                variant="outlined"
                autoComplete="text"
                margin="normal"    
                inputProps={{style: { padding: 18 }}}
                style={{height: '8rem'}}
                publishSignalName="3"
                subscribeSignalName="3" >
            </TextFieldCH>
            <div>Slider/Analog
                <ContinuousSliderCH orientation="horizontal" publishSignalName="36" subscribeSignalName="36"></ContinuousSliderCH>
            </div>
        </div>
    );
  }
}

export default Dashboard;