import { FC } from "react";
import { Result } from "antd";

import { Container, PermissionsPlaceholderBody } from "./index.styled";

type T = {
  geoPermissions?: boolean;
};

const PermissionsPlaceholder: FC<T> = ({ geoPermissions = true }) => {
  return (
    <>
      {!geoPermissions ? (
        <Container>
          <PermissionsPlaceholderBody>
            <Result
              status="404"
              title="Please, give permission for geolocation"
              subTitle="Geolocation needed for this app is not supported by this browser or no granted by user."
            />
          </PermissionsPlaceholderBody>
        </Container>
      ) : null}
    </>
  );
};

export default PermissionsPlaceholder;
