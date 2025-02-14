"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { AddFrame, type Context } from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE, ACTIVITIES } from "~/lib/constants";

function ActivityForecast({ activity }: { activity: keyof typeof ACTIVITIES }) {
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
  const { tempRange, conditions, icon } = ACTIVITIES[activity];
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{ACTIVITIES[activity].label} Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {days.map(day => (
            <div key={day} className="flex justify-between items-center">
              <Label className="text-sm">{day}</Label>
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {tempRange}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">{conditions}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [selectedActivity, setSelectedActivity] = useState<keyof typeof ACTIVITIES | null>(null);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});
      setIsSDKLoaded(true);
    };
    if (sdk && !isSDKLoaded) load();
  }, [isSDKLoaded]);

  if (!isSDKLoaded) return <div>Loading...</div>;

  // Fixed: Use correct property path from FrameContext
  const userLocation = context?.user?.username?.split('.')[0] || "your area";

  return (
    <div 
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
        backgroundImage: `url(${selectedActivity ? ACTIVITIES[selectedActivity].image : ACTIVITIES.GOOD_WEATHER.image})`,
      }}
      className="bg-cover bg-center min-h-screen bg-no-repeat"
    >
      <div className="bg-gradient-to-b from-black/30 to-black/60 absolute inset-0" />
      <div className="w-[300px] mx-auto py-2 px-2 relative z-10">
        <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {PROJECT_TITLE}
        </h1>
        
        {!selectedActivity ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Ideal Weather for {userLocation}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {Object.entries(ACTIVITIES).map(([key, activity]) => (
                <button
                  key={key}
                  onClick={() => setSelectedActivity(key as keyof typeof ACTIVITIES)}
                  className="p-3 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="text-lg">{activity.icon}</div>
                  <Label className="text-sm">{activity.label}</Label>
                </button>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div>
            <button 
              onClick={() => setSelectedActivity(null)}
              className="mb-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              ← Back to Activities
            </button>
            <ActivityForecast activity={selectedActivity} />
          </div>
        )}
      </div>
    </div>
  );
}
