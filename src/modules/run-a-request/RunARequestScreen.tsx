import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MainHeader from '../../common/components/MainHeader';
import ContainerNew from '../../common/components/Container';
import {COLORS} from '../../common/constant/Themes';
import SVGController from '../../common/components/SVGController';
import {ScrollView} from 'react-native-gesture-handler';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {api} from '../../common/api/api';
import {useIsFocused} from '@react-navigation/native';
import {httpRequest} from '../../common/constant/httpRequest';
import {useRootStore} from '../../stores/rootStore';
import {ProcgURL} from '../../../App';
import {ARMTaskParametersTypes, AsynchronousTask} from '../../types/arm/arm';
import CustomTextNew from '../../common/components/CustomText';
import {useToast} from '../../common/components/CustomToast';

type ParamMap = {
  [key: string]: number;
};

const RunARequestScreen = () => {
  const {selectedUrl} = useRootStore();
  const isFocused = useIsFocused();
  const toaster = useToast();
  const [loading, setIsLoading] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [armTasks, setArmTasks] = useState<AsynchronousTask[]>([]);
  const [parameters, setParameters] = useState<ARMTaskParametersTypes[]>([]);
  const [toSubmitParams, setToSubmitParams] = useState<
    Record<string, string | number>
  >({});
  const url = selectedUrl || ProcgURL;

  //Fetch ARM Tasks
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: api.GetARMTasks,
        baseURL: url,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = (await httpRequest(
        api_params,
        setIsLoading,
      )) as AsynchronousTask[];
      const tasks = res.filter(task => task.srs === 'Y');
      setArmTasks(tasks);
    },
    [isFocused],
  );

  const getTaskParametersByTaskName = async (task_name: string) => {
    try {
      const api_params = {
        url: `${api.GetParemeterByTaskName}${task_name}`,
        baseURL: url,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = (await httpRequest(
        api_params,
        setIsLoading,
      )) as ARMTaskParametersTypes[];

      setParameters(res);
      const param: Record<string, string | number> = res.reduce(
        (acc, item) => {
          acc[item.parameter_name] = 0;
          return acc;
        },
        {} as Record<string, number>,
      );
      setToSubmitParams(param);
    } catch (error) {
      console.log('Task Parameters Item Not found');
      return [];
    }
  };

  const formatString = (str: string) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePressTaskName = (taskName: string) => {
    setSelectedTask(taskName);
    setShowTasks(false);
    getTaskParametersByTaskName(taskName);
  };

  const handleChange = (key: string, newValue: string) => {
    const isNumber = !isNaN(Number(newValue));
    if (isNumber) {
      setToSubmitParams(prev => ({
        ...prev,
        [key]: Number(newValue),
      }));
    } else {
      setToSubmitParams(prev => ({
        ...prev,
        [key]: newValue,
      }));
    }
  };

  const handleSubmit = async () => {
    const adHocPostData = {
      task_name: selectedTask,
      parameters: toSubmitParams,
      schedule_type: 'IMMEDIATE',
    };

    const adHocParams = {
      url: api.PostTask,
      data: adHocPostData,
      method: 'post',
      baseURL: url,
      // isConsole: true,
      // isConsoleParams: true,
    };

    const response = await httpRequest(adHocParams, setIsLoading);
    if (response) {
      setToSubmitParams({});
      setSelectedTask('');
      toaster.show({message: response.message, type: 'success'});
    }
  };

  return (
    <ContainerNew header={<MainHeader routeName="Run a Request" />}>
      <View style={{marginHorizontal: 20}}>
        <TouchableOpacity
          style={styles.selectATaskBtn}
          onPress={() => setShowTasks(prev => !prev)}>
          <Text>Select a Task</Text>
          <SVGController name="Chevron-Down" />
        </TouchableOpacity>
      </View>

      {showTasks && (
        <Modal transparent visible={showTasks} animationType="fade">
          {/* Close modal when clicking outside */}
          <TouchableWithoutFeedback onPress={() => setShowTasks(false)}>
            <View style={styles.modalOverlay}>
              {/* Prevent modal from closing when clicking inside */}
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <ScrollView>
                    {armTasks.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          marginHorizontal: 16,
                          paddingVertical: 10,
                          borderBottomWidth: 1,
                          borderColor: COLORS.borderColor,
                        }}
                        onPress={() => handlePressTaskName(item.task_name)}>
                        <CustomTextNew text={formatString(item.task_name)} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      {selectedTask && (
        <View style={styles.tskName}>
          <Text style={{color: COLORS.darkGray, fontWeight: '400'}}>
            Task Name
          </Text>
          <Text style={{color: COLORS.black}}>
            {formatString(selectedTask)}
          </Text>
        </View>
      )}

      {parameters && selectedTask && (
        <View style={{marginTop: 10, marginHorizontal: 20}}>
          <CustomTextNew text={`Parameters`} style={{marginBottom: 10}} />
          {Object.entries(toSubmitParams).map(([key, value]) => (
            <View key={key} style={styles.paramBox}>
              <CustomTextNew text={`${key} : `} />
              <TextInput
                style={{flex: 1}}
                value={value.toString()}
                onChangeText={text => handleChange(key, text)}
              />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <CustomTextNew txtColor={COLORS.white} text={`Submit`} />
      </TouchableOpacity>
    </ContainerNew>
  );
};

export default RunARequestScreen;

const styles = StyleSheet.create({
  selectATaskBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.lightBackground,
    width: '90%',
    padding: 6,
    borderRadius: 8,
    maxHeight: 500,
    position: 'absolute',
    top: 130,
    right: 20, // Ensures scrollability
  },

  tskName: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.selectedColre,
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 20,
  },

  paramBox: {
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  submitBtn: {
    width: '90%',
    height: 40,
    backgroundColor: COLORS.primaryBtn,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 90,
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
  },
});
