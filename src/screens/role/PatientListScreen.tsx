import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PatientListScreen = () => {
  const handleInputChange = (key, value) => {
   
  };
  return (
   <SafeAreaView>
    <ScrollView>
        <CustomDropdown
              data={}
              selectedValue={}
              onValueChange={(value) => handleInputChange('', value)}
            />
    </ScrollView>
   </SafeAreaView>
  )
}

export default PatientListScreen

const styles = StyleSheet.create({})