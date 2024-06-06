import React, { Component } from 'react';
import { Platform,Image, ImageBackground, TouchableOpacity,BackHandler, Dimensions, StyleSheet, Text, View, AsyncStorage,TextInput } from 'react-native';
import APIManager from './APIManager';


export class APIScreen extends React.Component {

  // hide navigation backgroud
  static navigationOptions = { header: null }

   constructor(props) {  
     super(props);     
      this.state = { 
	     api:APIManager.host,		   
	    }              
   }    
        
   static navigationOptions = {
       header: <Image source={require('../../Images/Header3.png')} style={{width:'100%',marginTop:(Platform.OS === 'ios')?24:0 }} />,
       headerLeft:null  	   
    };	 	
 
	componentDidMount(){
		 BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
       AsyncStorage.getItem('api')
       .then((value)=>{
         if(value != null){
           this.setState({api:value})
         }
       })
	}

	async onSubmit(){	
    await AsyncStorage.setItem('api', this.state.api);
	  APIManager.getAPI()
	  this.props.navigation.goBack()
   }  
	  
	render() {

    return (
      <View style={styles.mainContainer}>
        <TextInput    
            style={styles.textInput}
            onChangeText={(api) => this.setState({api})}
            value={this.state.api}
			      placeholder="API"
		    />     
        
        <TouchableOpacity onPress={()=> this.onSubmit()} style={styles.button}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>	

        <TouchableOpacity onPress={() => this.props.navigation.goBack()}   style={styles.button} >
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
	  backgroundColor:'#ffffff'
  },
  textInput:{
	 width:'85%', borderBottomWidth:1    
	},
  button:{
     borderRadius: 5, backgroundColor: '#ff7f00', marginTop:15, width:'75%',height:50,  justifyContent:'center', alignItems:'center', elevation:8,
	},          
	buttonText:{        
     fontSize:20, color:'#ffffff', fontFamily:'GoogleSans-Medium',
	},	
});
