import React from "react";
import Button from "../../components/buttons/OrderButton";

const PrivacyScreen = () => {
  return (
    <div>
      <div>
        <Button
          title="Data tracking"
          onPress={() => console.log("Data tracking")}
          icon={0}
        />
        ,
      </div>
      <div>
        <Button
          title="Terms of Service"
          onPress={() => console.log("Terms of service")}
          icon={0}
        />
        ,
      </div>
    </div>
  );
};

export default PrivacyScreen;
