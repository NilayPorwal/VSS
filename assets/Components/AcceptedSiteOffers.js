
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, ScrollView, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


    
type Props = {};
export default class AcceptedSiteOffers extends Component<Props> {
	constructor(props) { 
     super(props);     
      this.state = { 
	    siteOfferDetails:this.props.navigation.state.params.siteOfferDetails
     }  
	}    
       
	
    static navigationOptions = {
       header: <Image source={require('../Images/Header3.png')} style={{width:'100%', marginTop:(Platform.OS === 'ios')?24:0 }} />,
       headerLeft:null  	   
    };	
	
	componentDidMount(){
		 BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}  
	
	
	reDirectTo(){
		this.props.navigation.navigate('MaterialInspected', {
			siteOfferDetails:this.state.siteOfferDetails
			
		})
	}
	
  render() {
    return (
	  <ImageBackground source={require('../Images/background.png')} style={{width: '100%', height: '100%'}}>
      <ScrollView>	  
      <View style={styles.container}>
	   
        
         
     <View style={{width:'20%'}} style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
	   <Icon name="chevron-left" size={20} color="#000000" style={{margin:15}}   />
      </TouchableOpacity>
      <View style={{width:'80%'}}> 
       <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', color:'black', paddingTop:15, textAlign:'center' }}>ACCEPTED SITE OFFER</Text>
      </View>  
     </View>
        
         
		 <View style={{borderWidth:1, margin:15}}>      
		 <View style={styles.tableHeader}>
		  <Text style={[styles.tableHeaderText, { width:'36%'}]}>Work Order No.</Text>
		  <Text style={[styles.tableHeaderText, { width:'34%'}]}>Site Offer ID</Text>
		  <Text style={[styles.tableHeaderText, { width:'30%'}]}>Inspection</Text>  
		 </View>
		     
		 <View style={styles.tableContent}>
		  <Text style={[styles.tableContentText,{width:'36%'}]}>{this.state.siteOfferDetails.woNumber}</Text>
		  <Text style={[styles.tableContentText,{width:'34%'}]}>{this.state.siteOfferDetails.siteOfferUnqId}</Text>
		  <Text style={{paddingTop:10,paddingBottom:10,  color:'#1b6379',fontFamily:'GoogleSans-Medium', textAlign:'center', textDecorationLine: 'underline', width:'30%'}} onPress={()=> this.reDirectTo()}>Start</Text>  
		 </View>   
  
		</View>  

        	
	    <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={styles.button}>
		  <Text style={styles.buttonText}>BACK</Text>
		</TouchableOpacity>		
		  
	  </View>
	  </ScrollView>	
      </ImageBackground>	  
    );               
  }          
}            

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    alignItems: 'center',
 },
    tableHeader:{  
	 flexDirection:'row', backgroundColor:'#141F25', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     padding:10, fontFamily:'GoogleSans-Medium', color:'#ffffff', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#ffffff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	color:'#141F25', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1, fontSize:12, paddingTop:10, paddingBottom:10
	},
	button:{
    borderRadius: 5, backgroundColor: '#ff7f00', marginTop:20, paddingVertical:10, paddingHorizontal:20	
	},
	buttonText:{
     fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium',	    
	},
	      
});
