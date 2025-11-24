'use client';

import React, { useEffect, useState } from 'react';
import {
  Dumbbell, Coffee, Star, Clock, Sun, Moon, Sunrise,
  TreePine, Home, Lightbulb, TrendingUp, Palette, Utensils, Film, Users,
  ShoppingBag, Activity, Landmark, Mountain, Briefcase, Heart, Smile
} from 'lucide-react';
import { Badge } from './ui/badge';
import { fetchActivitySuggestions } from '@/services/activitySuggestionService';
import { submitActivitySuggestion } from "@/services/activitySuggestionService";
import { SubmitSuccess } from "./SubmitSuccess";

// Map actual DB categories to Lucide icons
const iconMap = {
  Relaxation: Coffee,
  Creative: Palette,
  Culinary: Utensils,
  Entertainment: Film,
  Social: Users,
  Fitness: Dumbbell,
  Cultural: Landmark,
  Sport: Activity,
  Adventure: Mountain,
  Shopping: ShoppingBag,
  Productivity: Briefcase,
  Recreation: Smile,
  Wellness: Heart,
  default: Star,
};

// 💡 Updated: normalized and safe filtering
const getActivitySuggestions = (condition, windSpeed, allSuggestions = []) => {
  if (!allSuggestions.length)
    return { indoor: [], outdoor: [], featured: null };

  const currentCondition = condition?.trim() || "";
  const isWindy = windSpeed > 20;

  const matching = allSuggestions.filter(s => {
    const cond = (s.condition || "").trim();
    return cond === "any" || cond === currentCondition;
  });

  const indoor = matching.filter(s => s.indoor === true);
  const outdoor = matching.filter(s => s.indoor === false);

  let featured = null;
  if (isWindy) featured = indoor[0] || outdoor[0] || null;
  else featured = outdoor[0] || indoor[0] || null;

  return { indoor, outdoor, featured, weatherCondition: currentCondition };
};

const getEnergyColor = (level) => {
  switch (level) {
    case 'High': return 'bg-red-500/20 text-red-800 border-red-300/30';
    case 'Medium': return 'bg-amber-500/20 text-amber-800 border-amber-300/30';
    case 'Low': return 'bg-green-500/20 text-green-800 border-green-300/30';
    default: return 'bg-gray-500/20 text-gray-800 border-gray-300/30';
  }
};

const getTimeIcon = (timeOfDay) => {
  switch (timeOfDay) {
    case 'Morning': return Sunrise;
    case 'Afternoon': return Sun;
    case 'Evening': return Moon;
    default: return Clock;
  }
};

export function ActivitySuggestion({ temperature, condition, windSpeed }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const data = await fetchActivitySuggestions();
        const normalizedData = data.map(s => ({
          ...s,
          indoor: s.indoor === true || s.indoor === "true",
          condition: s.condition?.trim() || "any",
        }));
        setSuggestions(normalizedData);
      } catch (err) {
        console.error("❌ Error fetching suggestions:", err);
      }
    }

    loadSuggestions();
  }, []);

  const activities = getActivitySuggestions(condition, windSpeed, suggestions);

  return (
    <div className="p-6 bg-white/25 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:bg-black/20 dark:border-white/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white drop-shadow-md">
          <Star className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 drop-shadow-md">
            Activity Ideas
          </h3>
          <p className="text-sm text-gray-700 drop-shadow-sm">
            Perfect activities for {temperature}°C
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {(!activities.featured && activities.indoor.length === 0 && activities.outdoor.length === 0) ? (
          <div className="text-center py-6">
            <p className="italic text-gray-800 dark:text-gray-200">
              No activities to suggest for the current weather conditions! Why not suggest some?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Featured Activity */}
            {activities.featured && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-300/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    {React.createElement(iconMap[activities.featured.category] || iconMap.default, { className: "w-5 h-5" })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        🌟 Featured: {activities.featured.activity}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {activities.featured.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{activities.featured.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activities.featured.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {activities.featured.energyLevel} energy
                      </div>
                      <div className="flex items-center gap-1">
                        {React.createElement(getTimeIcon(activities.featured.timeOfDay), { className: "w-3 h-3" })}
                        {activities.featured.timeOfDay === "Any" ? "Any time" : activities.featured.timeOfDay}
                      </div>
                      <div className="flex items-end gap-1">
                        <p>- </p>
                        {activities.featured.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Outdoor */}
            {activities.outdoor.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TreePine className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-gray-900">Outdoor Adventures</h4>
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-400/30">
                    {activities.outdoor.length} options
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activities.outdoor.map((activity, i) => {
                    const TimeIcon = getTimeIcon(activity.timeOfDay);
                    const Icon = iconMap[activity.category] || iconMap.default;
                    return (
                      <div key={i} className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-600">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm mb-1 truncate">{activity.activity}</h5>
                            <p className="text-xs text-gray-700 mb-2 leading-relaxed">{activity.reason}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <TimeIcon className="w-3 h-3" />
                                {activity.duration}
                              </div>
                              <Badge className={`text-xs px-2 py-0.5 ${getEnergyColor(activity.energyLevel)}`}>
                                {activity.energyLevel}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <TimeIcon className="w-3 h-3" />
                                {activity.timeOfDay === "Any" ? "Any time" : activity.timeOfDay}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <p>- </p>
                                {activity.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Indoor */}
            {activities.indoor.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Indoor Comfort</h4>
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-400/30">
                    {activities.indoor.length} options
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activities.indoor.map((activity, i) => {
                    const TimeIcon = getTimeIcon(activity.timeOfDay);
                    const Icon = iconMap[activity.category] || iconMap.default;
                    return (
                      <div key={i} className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-600">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm mb-1 truncate">{activity.activity}</h5>
                            <p className="text-xs text-gray-700 mb-2 leading-relaxed">{activity.reason}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <TimeIcon className="w-3 h-3" />
                                {activity.duration}
                              </div>
                              <Badge className={`text-xs px-2 py-0.5 ${getEnergyColor(activity.energyLevel)}`}>
                                {activity.energyLevel}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <TimeIcon className="w-3 h-3" />
                                {activity.timeOfDay === "Any" ? "Any time" : activity.timeOfDay}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <p>- </p>
                                {activity.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggestion Form */}
        <div className="pt-8 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-gray-900">
              Have an idea for an activity?
            </h4>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Share your own suggestion! It could inspire others when the weather fits.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;

              const duration =
                form.durationFrom.value && form.durationTo.value
                  ? `${form.durationFrom.value}-${form.durationTo.value} ${form.durationUnit.value}`
                  : null;

              const suggestion = {
                name: form.name.value,
                activity: form.activity.value,
                reason: form.reason.value,
                duration,
                energyLevel: form.energyLevel.value,
                timeOfDay: form.timeOfDay.value,
                category: form.category.value,
                indoor: form.indoor.value === "true",
                condition: form.condition.value,
                status: "inactive",
              };

              try {
                await submitActivitySuggestion(suggestion);
                form.reset();
                setShowSuccess(true); // ✅ show toast
              } catch (err) {
                alert("Oops, something went wrong submitting your suggestion.");
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {/* Name of Submitter */}
            <input
              name="name"
              placeholder="Your name"
              className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80"
              required
            />

            {/* Activity Name */}
            <input
              name="activity"
              placeholder="Activity name"
              className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80"
              required
            />

            {/* Reason */}
            <input
              name="reason"
              placeholder="Why it's great"
              className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80 col-span-full"
              required
            />

            {/* Duration */}
            <div className="flex items-center gap-2 col-span-full sm:col-span-2">
              <label className="text-sm text-gray-700 whitespace-nowrap">Duration:</label>
              <select name="durationFrom" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
                {[...Array(11)].map((_, i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">to</span>
              <select name="durationTo" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
                {[...Array(11)].map((_, i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
              <select name="durationUnit" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
                <option value="hours">hours</option>
                <option value="minutes">minutes</option>
              </select>
            </div>

            {/* Energy Level */}
            <select name="energyLevel" defaultValue="" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
              <option value="" disabled>Energy Level</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            {/* Time of Day */}
            <select name="timeOfDay" defaultValue="" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
              <option value="" disabled>Time of Day</option>
              <option>Any</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>

            {/* Category */}
            <select name="category" defaultValue="" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
              <option value="" disabled>Category</option>
              {[
                "Relaxation", "Creative", "Culinary", "Entertainment", "Social",
                "Fitness", "Cultural", "Sport", "Adventure", "Shopping",
                "Productivity", "Recreation", "Wellness"
              ].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            {/* Indoor/Outdoor */}
            <select name="indoor" defaultValue="" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
              <option value="" disabled>Type of Activity</option>
              <option value="true">Indoor</option>
              <option value="false">Outdoor</option>
            </select>

            {/* Condition */}
            <select name="condition" defaultValue="" className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80">
              <option value="" disabled>Weather Condition</option>
              {[
                "Clear", "Mainly Clear", "Partly Cloudy", "Overcast",
                "Fog", "Rime Fog", "Light Drizzle", "Light Rain", "Moderate Rain",
                "Heavy Rain", "Snow", "Rain Showers", "Thunderstorm"
              ].map((cond) => (
                <option key={cond}>{cond}</option>
              ))}
            </select>


            {/* Submit Button */}
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-600
                text-white font-medium 
                transform hover:scale-105 
                transition-all duration-200 ease-in-out
                cursor-pointer
                active:scale-95
                hover:shadow-lg"
            >
              Submit Suggestion
            </button>


          </form>

        </div>
      </div>
      {showSuccess && <SubmitSuccess onClose={() => setShowSuccess(false)} />}
    </div>
  );
}