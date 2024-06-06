import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, ActivityIndicator,
        TouchableOpacity, ScrollView, ImageBackground, BackHandler} from 'react-native';
import APIManager from './Managers/APIManager';
import Icon from 'react-native-vector-icons/FontAwesome';  


    
type Props = {};
export default class SamplingMaterial extends Component<Props> {
	  
	    
     constructor(props) { 
     super(props);     
      this.state = { 
	    siteOfferDetails:{},
		isLoading:false,
		vendorId:this.props.navigation.state.params.vndrId,
		inspId:this.props.navigation.state.params.insId, 		 
		woId:this.props.navigation.state.params.woId, 		 
		matId:this.props.navigation.state.params.matId, 		 
		matscId:this.props.navigation.state.params.matscId,
		pdiId:this.props.navigation.state.params.pdiId,
		vendorDetails:this.props.navigation.state.params.vendorDetails,
		sample:null
     } 
    // alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails))	 
	}  
          
	  
    static navigationOptions = {
       header: <Image source={require('../Images/Header3.png')} style={{width:'100%', marginTop:(Platform.OS === 'ios')?24:0 }} />,
        headerLeft:null  	   
    };
	
	reDirectTo(){
		this.props.navigation.push('MaterialInspected', {
			siteOfferDetails:this.state.siteOfferDetails
		})    
	}
    
    componentDidMount(){
    	this.getSiteOfferDetails()
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	} 

    
uploadTestStatus(){
	this.setState({isLoading:true})
	 const Details =
         {
			"inspectionSiteAiId":this.state.siteOfferDetails.inspectionSiteAiId,
			"siteInspectionStatus":"0",
			"siteInspectionStatusRemarks":"1",
			"siteInspectionStage":"1", 
			"siteInspectionForm9":""
        }
  
		//alert(JSON.stringify(Details)) 
	APIManager.uploadTestStatus(Details,
        (responseJson)=> {
		 if(responseJson.status == 'SUCCESS'){	
          //alert(JSON.stringify(responseJson));
		  this.setState({isLoading:false})
		  this.reDirectTo()
		 }
		 else{
		  this.setState({isLoading:false})
         // alert('Please Try Again')		  
		 }  
       }, (error)=>{
       	   this.setState({isLoading:false})
       	   console.log(JSON.stringify(error))
       })		   
	  }  
 

	 getSiteOfferDetails(){
	    APIManager.getSiteOfferDetails(this.state.inspId, this.state.vendorId, this.state.woId, this.state.matId, this.state.matscId, this.state.pdiId,
        (responseJson)=> {
           console.log(JSON.stringify(responseJson))
		if(responseJson.status == 'SUCCESS'){	
          this.setState({siteOfferDetails:responseJson.data, isRefreshing:false})
          const sample =  responseJson.data.samplingRatio.toString().split('/')
          this.setState({sample})
        }
        else{
			this.setState({isRefreshing:false, error:true})
		}      
	   }, (error)=>{
       	   this.setState({isLoading:false})
       	   console.log(JSON.stringify(error))
       })		  
	 
	}           
		

  refresh(){
  	this.getSiteOfferDetails()
  }		   
	          
  render() {
    return (
    <ImageBackground source={require('../Images/background.png')} style={{width: '100%', height: '100%'}}>  

     <View style={{width:'20%'}} style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
	   <Icon name="chevron-left" size={20} color="#000000" style={{margin:15}}   />
      </TouchableOpacity>
      <View style={{width:'80%'}}> 
       <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', color:'black', paddingTop:15, textAlign:'center' }}>SAMPLING MATERIAL</Text>
      </View>  
     </View>  
	
	<ScrollView>
      <View style={styles.container}>
	   
	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium', marginLeft:15, marginTop:15}}>Work Information</Text> 
        <View style={styles.detailsView}>  
		    
		 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
		 <View style={{width:'50%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Tender No.</Text>
		   <Text style={{color:'black', flex:1,  flexWrap: 'wrap'}}>{this.state.siteOfferDetails.tenderNumber}</Text>    
		  </View>
		  
		  <View style={{width:'50%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium', textAlign:'right'}}>Work Order No.</Text>
		   <Text style={{color:'black', textAlign:'right', flex:1,  flexWrap: 'wrap'}}>{this.state.siteOfferDetails.woNumber}</Text>
		  </View>
		 </View>     
		 
		 <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
		  <View style={{width:'50%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Work Order ID</Text>
		   <Text style={{color:'black', flex:1,  flexWrap: 'wrap'}}>{this.state.siteOfferDetails.woCustomUnqId}</Text>
		  </View>
		      
		 <View style={{width:'50%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium', textAlign:'right'}}>Site Offer ID</Text>
		   <Text style={{color:'black', textAlign:'right', flex:1,  flexWrap: 'wrap'}}>{this.state.siteOfferDetails.siteOfferUnqId}</Text>
		  </View> 
		 </View>   
		</View>   

         <Text style={{color:'black', fontFamily:'GoogleSans-Medium', marginLeft:15, marginTop:15}}>Material Details</Text>
		 <View style={styles.detailsView}>
		   
		 <View style={{flexDirection:'row'}}>
		  <View style={{width:'60%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Category</Text>
		   <Text style={{color:'black', flex:1,  flexWrap: 'wrap'}}>{this.state.siteOfferDetails.materialName}</Text>
		  </View>  
		  
		  <View style={{width:'40%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium', textAlign:'right'}}>Unit</Text>
		   <Text style={{color:'black',textAlign:'right'}}>{this.state.siteOfferDetails.deliverySchUnit}</Text>
		  </View>
		 </View>       
		 
		 <View style={{flexDirection:'row',  marginTop:20}}>
		  <View style={{width:'60%'}}>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Sub Category </Text>
		   <Text style={{color:'black', flex:1,  flexWrap: 'wrap'}}>{this.state.siteOfferDetails.materialScName}</Text>
		  </View>
		      
	      <View style={{width:'40%'}}>   
		  
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium', textAlign:'right'}}>Quantity</Text>
		   <Text style={{color:'black',textAlign:'right'}}>{this.state.siteOfferDetails.inspectionSiteOfferQty}</Text>
		  </View>   
		</View>       
		    
	{(this.state.siteOfferDetails.withPackingList=="Y")?	
		<View style={{borderWidth:1, backgroundColor:'#ffffff', padding:15, marginTop:20,borderColor:'transparent'}}>  
		  <Text style={{color:'black', fontFamily:'GoogleSans-Medium', marginBottom:15}}>Material Serial No.</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>     
           <Text>From</Text>
           <Text style={{color:'black'}}>{this.state.siteOfferDetails.packStartSrno}</Text>
           <Text>To</Text>   
           <Text style={{color:'black'}}>{this.state.siteOfferDetails.packendSrno}</Text>        
		  </View>		  
			</View>:null}    
		 
		 <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:15}}>
		  <Text style={{fontFamily:'GoogleSans-Medium', fontSize:20, color:'brown'}}>SAMPLING RATIO</Text>
		
		 <View style={{flexDirection:'row'}}>
		   <Text style={{fontFamily:'GoogleSans-Medium', fontSize:20, color:'brown'}}>{this.state.siteOfferDetails.samplingRatio}</Text>

           <TouchableOpacity onPress={()=>this.props.navigation.push("EditSamplingRatio", {
               	matId:this.state.matId, 		 
		        matscId:this.state.matscId,
		        pdiId:this.state.pdiId,
		        onGoBack: () => this.refresh()
		     })}>
		   <Icon name="edit" size={20} color="#000000" style={{paddingLeft:8, paddingTop:3}}  />
          </TouchableOpacity>
		 </View>
		 </View>
		 
		 
		</View>  	  	    
 		        
		<View style={{justifyContent:'center', alignItems:'center'	}}>    
		 <TouchableOpacity onPress={()=>this.uploadTestStatus()} style={styles.button}>
		  {(this.state.isLoading==false)?
		  <Text style={{fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium',}}>START INSPECTION</Text>:
		  <ActivityIndicator size="small" color="#ffffff" />	}
		 </TouchableOpacity>
	    </View>   
	
	</View>          
   </ScrollView> 
   </ImageBackground>   
	);                   
  }      
}        

const styles = StyleSheet.create({
  container: {
    flex: 1,
   },
	
	tableHeader:{
	 flexDirection:'row', backgroundColor:'#33a0ff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     padding:10, fontFamily:'GoogleSans-Medium', color:'black', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#f9cda0', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	 padding:10,  color:'black', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1,	fontSize:12
	},
	button:{
	 borderRadius: 5, backgroundColor: '#3CB043',  marginVertical:15, paddingHorizontal:15, paddingVertical:10, elevation:8
	},
	detailsView:{
	  borderWidth:1, margin:15, padding:15, backgroundColor:'#FEC1A5', elevation:8, borderColor:'transparent'
	}

});        
  