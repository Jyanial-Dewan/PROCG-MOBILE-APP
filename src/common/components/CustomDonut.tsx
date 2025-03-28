import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {COLORS} from '../constant/Themes';

type DonutChartProps = {
  data: any;
  isShowText?: boolean;
  text?: string;
  textData?: string | number;
  total: number;
  radius: any;
  footerData?: any;
  sevenDays?: number;
};

const CustomDonutChartNew = ({
  data,
  isShowText,
  text,
  textData,
  total,
  radius,
  footerData,
  sevenDays,
}: DonutChartProps) => {
  const getColor = (name: string) => {
    if (name?.trim() === 'Present') {
      return '#34A853';
    }
    if (name?.trim() === 'Late') {
      return '#F63D68';
    }
    if (name?.trim() === 'Absent') {
      return '#FEC84B';
    }
  };

  const modifiedData =
    data &&
    data?.map((item: any) => {
      return {
        ...item,
        strokeDasharray: item?.rotation > 0 ? item?.strokeDasharray : 0,
        strokeDashoffset: item?.rotation ? item?.strokeDashoffset : 0,
      };
    });

  const days =
    sevenDays !== 7
      ? footerData?.totalEmployeeCount
      : footerData?.totalEmployeeCount * 7;
  return (
    <View>
      <View style={styles.main}>
        <Svg height="200" width="200" viewBox="0 0 180 180">
          <G rotation={-90} originX="90" originY="90">
            {total === 0 ? (
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={COLORS.lightPrimary}
                fill="transparent"
                strokeWidth="35"
              />
            ) : (
              <>
                {modifiedData?.map((item: any, index: any) => (
                  <Circle
                    key={index}
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={item?.color}
                    fill="transparent"
                    strokeWidth="35"
                    strokeDasharray={item?.strokeDasharray}
                    strokeDashoffset={item?.strokeDashoffset}
                    rotation={item?.rotation}
                    originX="90"
                    originY="90"
                    strokeLinecap="butt"
                  />
                ))}
              </>
            )}
          </G>
        </Svg>
        {isShowText && (
          <>
            <View style={styles.pDays}>
              <Text style={styles.circleText}>{textData}</Text>
              <Text style={styles.txtInDonut}>{text} </Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.footerSection}>
        <Text style={styles.status}>Status</Text>
        <Text style={styles.status}>Employees</Text>
      </View>

      <View style={styles.bar} />

      {footerData?.attendanceDonutChartData?.map(
        (item: {name: string; value: number}, index: any) => (
          <View key={index}>
            <View style={styles.footerSection}>
              <View style={styles.footerSection}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: getColor(item?.name),
                    },
                  ]}
                />
                <Text style={styles.name}>{item?.name}</Text>
              </View>
              <View style={styles.footerSection}>
                <Text style={styles.number}>{item?.value}</Text>
                <Text style={styles.percentage}>
                  ({((item?.value * 100) / days).toFixed(1)} %)
                </Text>
              </View>
            </View>
            {index === 2 ? null : <View style={styles.bar} />}
          </View>
        ),
      )}
    </View>
  );
};

export default CustomDonutChartNew;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'center',
  },
  // text: { fontWeight: '700', textAlign: 'center', fontSize: 18 },

  txtInDonut: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
    textAlign: 'center',
  },
  pDays: {
    position: 'absolute',
    marginTop: 80,
    width: 100,
    alignSelf: 'center',
  },
  circleText: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: COLORS.textNewColor,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circle: {
    height: 15,
    width: 15,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  bar: {height: 1, backgroundColor: COLORS.bar, marginVertical: 8},
  status: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  name: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    marginLeft: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingRight: 5,
  },
  percentage: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
});
