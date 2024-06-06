import React, { Component } from 'react';
import {Platform,Dimensions, StyleSheet,View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';  
    

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.5;   
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even, index } = this.props;

        return parallax ? (
            <ParallaxImage
              source={illustration}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={illustration}
              style={styles.image}
            />
        );
    }

     redirectTo(){ 
          if(this.props.odd) {
              this.props.navigate("logInScreen")
            }
            else{
              this.props.navigate("SignUpScreen")
            }
    }

    render () {
        const { data: { title, subtitle }, even , index} = this.props;

       // alert(even)

        return ( 
         <View>   
         {(index===0 || index===3 || index===6 )?     
         <View style={{backgroundColor:"#51C6C9",  height:viewportHeight*0.4, width:itemWidth, alignItems:"center", justifyContent:"center", borderRadius:10}}>
 

                  <View style = {styles.outSideCircle}>
                   <View style= {styles.insideOutSideCircle}>
                    <View style= {styles.insideCircle}>
                    </View> 
                   </View>
                  </View>
                     
           <View style={{position:"absolute", top:viewportHeight*0.1, left:0, bottom:0, right:0, alignItems:"center", justifyContent:"center"}}> 
            
              <Icon name="users" size={50} color="#ffffff"  />
               <TouchableOpacity onPress={()=>this.props.navigate("AboutUsScreen")} style={{backgroundColor:"#EC7E41", padding:15, borderRadius:50, marginTop:25, width:viewportWidth*0.4}}> 
                <Text style={{color:"#ffffff", fontFamily:'GoogleSans-Medium',  fontSize:15, textAlign:"center"}}> About Us </Text>
               </TouchableOpacity> 
           
           </View>      
          </View>:null}  

         {(index===1 || index===4 || index===7)?     
         <View style={{backgroundColor:"#6D70FF",  height:viewportHeight*0.4, width:itemWidth, alignItems:"center", justifyContent:"center", borderRadius:10}}>
 

                  <View style = {styles.outSideCircle}>
                   <View style= {styles.insideOutSideCircle}>
                    <View style= {styles.insideCircle}>
                    </View>
                   </View>
                  </View>
                     
           <View  style={{position:"absolute", top:viewportHeight*0.1, left:0, bottom:0, right:0, alignItems:"center", justifyContent:"center"}}> 
             <Icon name="clipboard-check" size={50} color="#ffffff"  />
            
              <TouchableOpacity onPress={()=>this.props.navigate("SignUpScreen")} style={{backgroundColor:"#EC7E41", padding:15, borderRadius:50, marginTop:25, width:viewportWidth*0.4}}> 
                <Text style={{color:"#ffffff", fontFamily:'GoogleSans-Medium',  fontSize:15, textAlign:"center"}}> Sign Up </Text>
               </TouchableOpacity> 
           </View>    
          </View>:null}  

        {(index===2 || index===5 || index===8)?     
         <View style={{backgroundColor:"#7A81AA",  height:viewportHeight*0.4, width:itemWidth, alignItems:"center", justifyContent:"center", borderRadius:10}}>
 

                  <View style = {styles.outSideCircle}>
                   <View style= {styles.insideOutSideCircle}>
                    <View style= {styles.insideCircle}>
                    </View>
                   </View> 
                  </View>    
                     
           <View style={{position:"absolute", top:viewportHeight*0.1, left:0, bottom:0, right:0, alignItems:"center", justifyContent:"center"}}> 
               <Icon name="sign-in-alt" size={50} color="#ffffff"  />
               <TouchableOpacity  onPress={()=>this.props.navigate("LogInScreen")} style={{backgroundColor:"#EC7E41", padding:15, borderRadius:50, marginTop:25, width:viewportWidth*0.4}}> 
                <Text style={{color:"#ffffff", fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:"center"}}> Sign In </Text>
               </TouchableOpacity> 
           </View>    
          </View>:null}  
        </View>
        );   
    }
}   
const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

const styles =  StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
       // backgroundColor: 'white',
          justifyContent:"center",
          alignItems:"center",
      // borderTopLeftRadius: entryBorderRadius,
       //borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
       // backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
     textContainerTop: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white', 
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 15,
        fontFamily:'GoogleSans-Medium',
        letterSpacing: 0.5,
        textAlign:"center"
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    outSideCircle:{
      alignItems:'center',
      justifyContent:"center",
      backgroundColor:'#0000001A',
      height: viewportHeight*0.3, 
      width: viewportWidth*0.6,
      borderRadius: viewportWidth*0.3, 
    },
   
insideOutSideCircle:{
    alignItems:'center',
    justifyContent:"center", 
    backgroundColor:'#0000001A',
    height: viewportHeight*0.2,
    width: viewportWidth*0.4,
    borderRadius: viewportWidth*0.2,
},
insideCircle:{   
  
    backgroundColor:'#0000001A',
    height: viewportHeight*0.1,
    width: viewportWidth*0.2,
    borderRadius:  viewportWidth*0.1,
},
});