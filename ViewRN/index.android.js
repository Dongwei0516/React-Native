/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  NetInfo,
  ScrollView,
  View,
  Linking,
  ToastAndroid,
  TouchableHighlight,
  TimePickerAndroid,
  DatePickerAndroid,
  DrawerLayoutAndroid,
} from 'react-native';

const ToolbarAndroid = require('ToolbarAndroid');

class CustomButton extends Component{
  render(){
    return(
      <TouchableHighlight style={styles.button}
         underlayColor='#a5a5a5'
         onPress={this.props.onPress}>
         <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class LinkButton extends Component{
  propsTypes:{
    url: React.propsTypes.string,
  }
  render(){
    return(
      <TouchableHighlight style={styles.button}
      underlayColor='#a5a5a5'
      onPress={() => Linking.canOpenURL(this.props.url).then(supported =>{
        if (supported) {
          Linking.openURL(this.props.url);
        }else {
          console.log('打开失败：'+this.props.url);
        }
      })}>
      <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
    }
  }

export default class ViewRN extends Component {

  constructor(props){
    super(props);
    this.state={
      isoFormatText: 'pick a time (24-hour format)',
      presetHour: 4,
      presetMinute: 4,
      presetText: 'pick a time, default: 4:04AM',
      simpleText: 'pick a time',
      presetDate: new Date(2017, 1, 19),
      isConnected: null,
      connectionInfo: null,
    };
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener(
      'change',this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
      (isConnected) => {this.setState({isConnected});}
    );
    NetInfo.fetch().done(
      (connectionInfo) => {this.setState({connectionInfo});}
    );
    var url = Linking.getInitialURL().then((url) =>{
      if (url) {
        console.log('URL:'+url)
      }
    }).catch(err => console.error('Error:',err));
  }

  componentWillUnmount(){
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleConnectivityChange
    );
  }
  _handleConnectivityChange(isConnected){
    ToastAndroid.show((isConnected ? 'online':'offline'),ToastAndroid.SHORT);
  }

  async showPicker(options){
    try {
      const{action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        ToastAndroid.show('选择时间为:'+this._formatTime(hour, minute),ToastAndroid.SHORT);
      }else  if (action === TimePickerAndroid.dismissedAction) {
        ToastAndroid.show('选择器关闭', ToastAndroid.SHORT);
      }
    } catch ({code, message}) {
        ToastAndroid.show('ERROR：'+ message, ToastAndroid.SHORT);
    }
  }

  async datePicker(stateKey, options){
    try {
     var newState = {};
     const {action, year, month, day} = await DatePickerAndroid.open(options);
     if (action === DatePickerAndroid.dismissedAction) {
       newState[stateKey + 'Text'] = 'dismissed';
     } else {
       var date = new Date(year, month, day);
       newState[stateKey + 'Text'] = date.toLocaleDateString();
       newState[stateKey + 'Date'] = date;
     }
     this.setState(newState);
   } catch ({code, message}) {
     console.warn(`Error in example '${stateKey}': `, message);
   }
  }

  _formatTime(hour, minute){
    return hour + ':'+(minute < 10 ?'0'+minute:minute);
  }

  render() {
    const navigationView = (
      <View style={{flex:1, backgroundColor:'#fff'}}>
      <Text style={{margin: 10, fontSize: 15}}>DrawerLayout!
      </Text>
      <ScrollView showsVerticalScrollIndicator={true}
         contentContainerStyle={styles.contentContainer}>
         <Text style={{color:'#FFF', margin:10,fontSize:15,backgroundColor:'gray'}}>1</Text>
         <Text style={{color:'#FFF', margin:10,fontSize:15,backgroundColor:'gray'}}>2</Text>
         <Text style={{color:'#FFF', margin:10,fontSize:15,backgroundColor:'gray'}}>3</Text>
         <Text style={{color:'#FFF', margin:10,fontSize:15,backgroundColor:'gray'}}>4</Text>
         <Text style={{color:'#FFF', margin:10,fontSize:15,backgroundColor:'gray'}}>5</Text>
      </ScrollView>
      </View>
    );
    return (

      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        renderNavigationView={()=>navigationView}>
        <ToolbarAndroid
          actions={toolbarAndroid}
          style={styles.toolbar}
          title="AAA"
          subtitle="aaa"></ToolbarAndroid>
        <View style={{flex:1 ,alignItems:'center'}}>
          <Text style={{margin:10, fontSize:15}}>React-Native
          </Text>
          <Text style={{margin:10, fontSize:15}}>ANDROID
          </Text>
          <Text style={{margin:10, fontSize:15}}>TimePickerAndroid
          </Text>
          <CustomButton
             text="DatePicker-指定日期"
             onPress={this.datePicker.bind(this, 'preset', {date: this.state.presetDate})} />
          <CustomButton
             text="TimePicker-指定时间"
             onPress={this.showPicker.bind(this,{hour:20,minute:34,})} />
          <CustomButton
             text="TimePicker-12/24"
             onPress={this.showPicker.bind(this,{hour:20, minute:34, is24Hour:true,})} />
          <Text style={styles.welcome}>
             当前的网络状态</Text>
          <Text style={styles.welcome}>
             {this.state.isConnected ? 'OnLine' : 'OffLine'}
          </Text>
          <Text style={styles.welcome}>
             当前网络连接类型
          </Text>
          <Text style={styles.welcome}>
             {this.state.connectionInfo}
          </Text>
          <Text style={styles.welcome}>
             当前连接网络是否计费
          </Text>
          <Text style={styles.welcome}>
             {NetInfo.isConnectionExpensive === true ? '需要计费' : '不要'}
          </Text>
          <LinkButton url={'http://www.cleargrass.com'} text="打开http网页"/>
            <LinkButton url={'https://www.baidu.com'} text="打开https网页"/>
              <LinkButton url={'smsto:1234567'} text="发送短信"/>
                <LinkButton url={'tel:1234567'} text="打电话"/>
                  <LinkButton url={'mailto:wei.dong@cleargrass.com'} text="发送邮件"/>
          </View>
          </DrawerLayoutAndroid>
    );
  }
}

var toolbarAndroid= [
  {title: 'Create', show: 'always'},
  {title: 'Setting'}
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  contentContainer: {
    margin: 10,
    backgroundColor: '#F5FCFF',
  },
  toolbar:{
    backgroundColor: '#e9eaed',
    height: 56,
  },
  botton:{
    margin:15,
    backgroundColor: 'white',
    paddingTop: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cdcdcd',
  },
});

AppRegistry.registerComponent('ViewRN', () => ViewRN);
