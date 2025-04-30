import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerNew from '../../common/components/Container';
import CustomTextNew from '../../common/components/CustomText';
import MainHeader from '../../common/components/MainHeader';
import CustomInputNew from '../../common/components/CustomInput';
import {useForm, useFormState} from 'react-hook-form';
import {COLORS} from '../../common/constant/Themes';
import CustomButtonNew from '../../common/components/CustomButton';
import {RootStackScreenProps} from '~/navigations/RootStack';
import {useRootStore} from '../../stores/rootStore';
import {observer} from 'mobx-react-lite';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface PayloadType {
  link: string;
}

const initValue = {
  link: '',
};

const AddConnection = observer<RootStackScreenProps<'AddConnection'>>(
  ({navigation}) => {
    const rootStore = useRootStore();
    const {control, handleSubmit, setValue} = useForm({
      defaultValues: initValue,
    });
    const {isDirty} = useFormState({control});

    const onSubmit = (data: PayloadType) => {
      const payload = {
        link: data?.link,
        checked: true,
      };

      if (payload.link.trim()) {
        rootStore.addUrl(payload.link.trim());
        rootStore.setSelectedUrl(payload.link.trim());
        navigation.goBack();
      }
    };
    return (
      <ContainerNew
        backgroundColor={COLORS.lightBackground}
        header={<MainHeader routeName="Add_Connection" />}
        footer={
          <CustomButtonNew
            disabled={isDirty}
            btnText="Done"
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={styles.btn}
            btnTextStyle={styles.btnTxt}
          />
        }>
        <View style={styles.container}>
          <CustomTextNew text="Connection Link" txtSize={14} padBottom={14} />
          <CustomInputNew
            textInputStyle={styles.textInputStyle}
            setValue={setValue}
            control={control}
            name="link"
            label="Enter Connection link"
            rules={{required: true}}
          />
          <CustomTextNew
            text="Scan here"
            txtSize={14}
            padBottom={14}
            padTop={14}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ScanQrConnection')}
            style={styles.box}>
            <View style={styles.innerBoxContainer}>
              <AntDesign name="qrcode" size={24} color="black" />
              <CustomTextNew
                text={'Tap to Scan'}
                txtWeight={400}
                txtSize={15}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ContainerNew>
    );
  },
);

export default AddConnection;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  textInputStyle: {
    backgroundColor: COLORS.white,
    color: COLORS.inputTextColor,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  buttonText: {
    fontSize: 14.5,
    fontWeight: '400',
    alignSelf: 'center',
    color: COLORS.black,
  },

  btn: {
    height: 54,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,

    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    borderColor: COLORS.lightGray5,
    backgroundColor: COLORS.white,
  },
  innerBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
});
