import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import {COLORS} from '../../common/constant/Themes';
import CustomTextNew from '../../common/components/CustomText';
import Row from '../../common/components/Row';
import {useRootStore} from '../../stores/rootStore';
import {observer} from 'mobx-react-lite';
import CustomFlatListTwo from '../../common/components/CustomFlatListTwo';
import {TextInput} from 'react-native-paper';
import SVGController from '../../common/components/SVGController';
import CustomBottomSheetNew from '../../common/components/CustomBottomSheet';
import RBSheet from '../../common/packages/RBSheet/RBSheet';

export const ITEMHEIGHT = 10;

const RenderViewRequestItem = memo(
  ({item}: any) => {
    const timeString = item.timestamp;
    const date = new Date(timeString);
    const refSheet = useRef<RBSheet>(null);

    // Open Bottom Sheet
    const onOpenSheet = () => {
      refSheet.current?.open();
    };
    return (
      <TouchableOpacity
        onPress={() => onOpenSheet()}
        activeOpacity={1}
        style={styles.container}>
        {/* Text Section */}
        <Row justify="space-between" align="center">
          <CustomTextNew
            txtStyle={styles.requestIdText}
            text={`Request Id - ${item.request_id}`}
          />
          {item.status === 'SUCCESS' ? (
            <CustomTextNew txtStyle={styles.successText} text={item.status} />
          ) : (
            <CustomTextNew txtStyle={styles.unsuccessText} text={item.status} />
          )}
        </Row>
        <Row>
          <CustomTextNew
            txtColor={COLORS.inputTextColor}
            txtSize={14}
            txtWeight={400}
            text={'User Task Name'}
          />
          <CustomTextNew padLeft={5} text={'-'} />
          <CustomTextNew
            txtColor={COLORS.inputTextColor}
            txtSize={14}
            txtWeight={300}
            padLeft={5}
            text={item.user_task_name}
          />
        </Row>
        <Row>
          <CustomTextNew
            txtColor={COLORS.inputTextColor}
            txtSize={14}
            txtWeight={400}
            text={'User schedule Name'}
          />
          <CustomTextNew padLeft={5} text={'-'} />
          <CustomTextNew
            txtColor={COLORS.inputTextColor}
            txtSize={14}
            txtWeight={300}
            padLeft={5}
            text={item.user_schedule_name}
          />
        </Row>
        <Row>
          <CustomTextNew
            txtColor={COLORS.inputTextColor}
            txtSize={14}
            txtWeight={400}
            text={'Timestamp'}
          />
          <CustomTextNew padLeft={5} text={'-'} />
          <CustomTextNew
            txtColor={COLORS.inputTextColor}
            txtSize={14}
            txtWeight={300}
            padLeft={5}
            text={`${date.toDateString()}, ${date.toLocaleTimeString()}`}
          />
        </Row>
        <View style={styles.itemListWrapper} />
        {/* Bottom Sheet */}
        <CustomBottomSheetNew refRBSheet={refSheet} sheetHeight={300}>
          <Row align="center">
            <CustomTextNew
              text="Parameters:"
              txtColor={COLORS.black}
              txtSize={16}
              txtWeight={500}
            />

            {item.parameters.size > 0 ? (
              [...item.parameters.entries()].map(([keys, value], index) => (
                <CustomTextNew
                  key={index}
                  text={`${keys}: ${value}`}
                  txtColor={COLORS.inputTextColor}
                  txtSize={14}
                  txtWeight={300}
                  padLeft={5}
                />
              ))
            ) : (
              <CustomTextNew
                text="null"
                txtColor={COLORS.inputTextColor}
                txtSize={14}
                txtWeight={400}
                padLeft={5}
              />
            )}
          </Row>

          <Row align="center">
            <CustomTextNew
              text="Result:"
              txtColor={COLORS.black}
              txtSize={16}
              txtWeight={500}
            />
            <CustomTextNew
              text={item.result.values().next().value}
              txtColor={COLORS.inputTextColor}
              txtSize={14}
              txtWeight={400}
              padLeft={5}
            />
          </Row>
        </CustomBottomSheetNew>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item === nextProps.item;
  },
);

const ViewRequestsScreen = observer(() => {
  const {viewRequestStore} = useRootStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [text, setText] = useState('');

  useEffect(() => {
    viewRequestStore.getRequests(currentPage, 10);
  }, [currentPage]);

  const renderViewRequestItem = useCallback(
    ({item}: any) => <RenderViewRequestItem item={item} />,
    [],
  );

  return (
    <ContainerNew
      isScrollView={false}
      backgroundColor={COLORS.lightBackground}
      header={<MainHeader routeName="View_Requests" />}>
      {/* <View style={{position: 'relative', marginHorizontal: 20}}>
        <TextInput
          style={styles.searchInput}
          outlineStyle={{borderWidth: 0}}
          mode="outlined"
          textColor={COLORS.black}
          placeholder="Search by User Task"
          placeholderTextColor="#9CA3AF"
          value={text}
          onChangeText={text => setText(text)}
        />
        <View style={{position: 'absolute', top: 15, left: 16}}>
          <SVGController name="SEARCH" />
        </View>
      </View> */}

      <CustomFlatListTwo
        data={viewRequestStore.requests}
        isLoading={viewRequestStore.loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        RenderItems={renderViewRequestItem}
      />
    </ContainerNew>
  );
});

export default ViewRequestsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  requestIdText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.textNewColor,
  },
  successText: {
    backgroundColor: COLORS.successColor,
    borderRadius: 3,
    padding: 10,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
  unsuccessText: {
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    padding: 10,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    borderRadius: 8,
    paddingLeft: 35,
  },
});
