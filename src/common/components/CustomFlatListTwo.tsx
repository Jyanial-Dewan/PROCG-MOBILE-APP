import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeEventEmitter,
  StyleSheet,
  View,
} from 'react-native';
import {COLORS} from '../constant/Themes';
import {ITEMHEIGHT} from '../../modules/view-requests/ViewRequestsScreen';

interface Props {
  data: any;
  isLoading?: boolean;
  setCurrentPage?: any;
  RenderItems: any;
  contentContainerStyle?: any;
  currentPage?: any;
  horizontal?: boolean;
  numColumns?: number;
  showHorizontalScrollIndicator?: boolean;
  headerComponent?: any;
  isStickyHeader?: boolean;
}

function throttle(func: Function, delay: number) {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
const CustomFlatListTwo: React.FC<Props> = ({
  data = [],
  isLoading,
  setCurrentPage,
  RenderItems,
  contentContainerStyle = {},
  currentPage,
  horizontal,
  numColumns,
  showHorizontalScrollIndicator,
  headerComponent,
  isStickyHeader = false,
}: Props) => {
  const renderMoreDataLoader = () => {
    return (
      isLoading && <ActivityIndicator size="large" color={COLORS.primary} />
    );
  };
  const onEndReached = () => {
    // data?.length >= currentPage * 5 && setCurrentPage((prev: any) => prev + 1);
    setCurrentPage((prev: any) => prev + 1);
  };

  const throttledOnEndReached = useCallback(
    throttle(() => {
      if (currentPage) {
        onEndReached();
      }
    }, 2000),
    [],
  );

  const keyExtractor = useCallback(
    (item: any) => item.request_id.toString(),
    [],
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showHorizontalScrollIndicator}
      contentContainerStyle={[
        contentContainerStyle,
        {
          ...styles.main,
          paddingBottom: contentContainerStyle?.paddingBottom,
        },
      ]}
      ListHeaderComponent={headerComponent}
      stickyHeaderIndices={isStickyHeader ? [0] : undefined}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      data={data}
      renderItem={RenderItems}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderMoreDataLoader}
      onEndReached={throttledOnEndReached}
      onEndReachedThreshold={0.1}
      getItemLayout={(data, index) => ({
        length: ITEMHEIGHT,
        offset: ITEMHEIGHT * index,
        index,
      })}
    />
  );
};

export default CustomFlatListTwo;

const styles = StyleSheet.create({
  main: {
    paddingBottom: 20,
  },
});
