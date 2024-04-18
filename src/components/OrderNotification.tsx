import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTailwind } from 'nativewind';
interface OrderNotificationProps {
  fare: number;
  onAccept: () => void;
  onReject: () => void;
}
const OrderNotification: React.FC<OrderNotificationProps> = ({ fare, onAccept, onReject }) => {
  const tailwind = useTailwind();
  return (
    <View style={tailwind('p-4 bg-white rounded-lg shadow-md m-4')}>
      <Text style={tailwind('text-lg font-bold text-center mb-2')}>New Trip Request</Text>
      <Text style={tailwind('text-md text-center mb-4')}>Fare: ${fare.toFixed(2)}</Text>
      <View style={tailwind('flex-row justify-around')}>
        <TouchableOpacity
          onPress={onAccept}
          style={tailwind('bg-green-500 px-4 py-2 rounded-full')}
        >
          <Text style={tailwind('text-white font-bold')}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onReject}
          style={tailwind('bg-red-500 px-4 py-2 rounded-full')}
        >
          <Text style={tailwind('text-white font-bold')}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default TripNotificationPopup;
