import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

import { useAppContext } from "./AppContext";
import type { CityResult } from "./utils/types";
import { CountryDropdown } from "./components/country-dropdown";
function Widget4() {
  const {
     selectedCity:sc,
}= useAppContext();



  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>City Info</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
       <CountryDropdown/>
       <div >{sc ==null? "No result":`${sc.name} ${sc.longitude} ${sc.latitude}`}</div>
        
      </CardContent>
    </Card>
  );
};

export default Widget4;
