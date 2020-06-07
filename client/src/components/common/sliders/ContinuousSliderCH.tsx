import React, { useState, useEffect } from "react";
import { WithStyles, createStyles, Theme, withStyles } from "@material-ui/core";
import { ClassValue } from 'classnames/types';
import { StyleRules } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import Button from "@material-ui/core/Button";
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

declare var CrComLib: typeof import('@crestron/ch5-crcomlib');
const WIDTH = 250;
const MINPERCENT = 0;
const MAXPERCENT = 100;
const MINVALUE = 0;
const MAXVALUE = 65535;

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    root: {
        width: WIDTH,
      }
  });

// Just my own custom/extended props

interface OwnProps {
    publishSignalName: string,
    subscribeSignalName: string,
    style?: ClassValue;
}
// Exposed to user's of component - not styles
type PublicProps = OwnProps & SliderProps;
type Props = PublicProps & WithStyles<typeof styles>;


const ContinuousSliderCH: React.FC<Props> = (props) => {    
    // decontruct props  - 
    // styles HOC, OwnProps, parent props passed
    const {classes,
        publishSignalName,
        subscribeSignalName,
        style,
        ...rest             // gets all the est of the props not specified above (we dont have all the names)
    } = props;

    // State
    const [sliderValue, setSliderValue] = useState(30);

    // Keep range 0-100%
    const setRangeSlider = (value: number) => {
        let newValue = value;
        let newPercentValue = Math.round((newValue / (MAXVALUE-MINVALUE)) * 100);

        if (newPercentValue < MINPERCENT) {
            newPercentValue = MINPERCENT;
        } else if (newPercentValue > MAXPERCENT) {
            newPercentValue = MAXPERCENT;
        }
        
        console.log(`setRangeSlider: value ${newValue}. percent value ${newPercentValue}`);
        setSliderValue(newPercentValue);
    }
      
    // const handleChange = (event: React.ChangeEvent<{}>, signalName: string, newValue: number) => {
    const handleChange = (event: React.ChangeEvent<{}>, signalName: string, percent: number) => {
        // convert to MINPERCENT MAXPERCENT range for crestron
        let newPercentValue = percent;
        if (newPercentValue < MINPERCENT) {
            newPercentValue = MINPERCENT;
        } else if (newPercentValue > MAXPERCENT) {
            newPercentValue = MAXPERCENT;
        }
        let newValue = Math.round((newPercentValue /100)*(MAXVALUE-MINVALUE));
        console.log(`handleChange: ${signalName}, value ${newValue}. percent value ${newPercentValue}`);

        setSliderValue(percent);
        CrComLib.publishEvent('number', signalName, newValue);
    };

    const handleRawChange = ( event: React.ChangeEvent<{}>, signalName: string, newValue: number) => {
        // console.log(`handleRawChange: value ${newValue}`);
        setSliderValue(newValue);
    };
    

    const handleClick = (signalName: string, percent: number) => {     
        // convert to MINPERCENT MAXPERCENT range for crestron
        let newPercentValue = percent;
        if (newPercentValue < MINPERCENT) {
            newPercentValue = MINPERCENT;
        } else if (newPercentValue > MAXPERCENT) {
            newPercentValue = MAXPERCENT;
        }
        let newValue = Math.round((newPercentValue /100)*(MAXVALUE-MINVALUE));
        console.log(`handleClick: ${signalName}, value ${newValue}. percent value ${newPercentValue}`);

        setSliderValue(newPercentValue);
        CrComLib.publishEvent('number', signalName, newValue);
    };

    useEffect(() => {
        let subscriptionId: string = "";
        if (subscribeSignalName) {
            subscriptionId = CrComLib.subscribeState('number', subscribeSignalName, setRangeSlider);
        }
        // When it ends
        return () => {
            CrComLib.unsubscribeState('number', subscribeSignalName, subscriptionId);
        }
    }, [subscribeSignalName]);
        
    return (
        <div className={classes.root}>
            <Typography id="continuous-slider" gutterBottom>
                Volume
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button value={sliderValue} onClick={() => handleClick(publishSignalName, sliderValue - 1)}>
                        <VolumeDown />
                    </Button>
                </Grid>
                <Grid item xs>
                    <Slider {...rest} className={` ${style}`} value={sliderValue}
                        min={MINPERCENT}
                        max={MAXPERCENT}
                        onChange={(e, val) => handleRawChange(e, publishSignalName, val as number)} 
                        onChangeCommitted={(e, val) => handleChange(e, publishSignalName, val as number)}
                        aria-labelledby="continuous-slider" 
                    >
                        {rest.children}
                    </Slider>               
                    </Grid>
                <Grid item>
                <Button 
                    value={sliderValue}
                    onClick={() => handleClick(publishSignalName, sliderValue + 1)}
                    >
                    <VolumeUp />
                </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withStyles(styles)(ContinuousSliderCH) as React.ComponentType<PublicProps>;
