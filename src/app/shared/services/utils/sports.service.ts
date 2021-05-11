import * as _ from "lodash";
import { Injectable } from "@angular/core";

export interface RCSportItem {
  id: number;
  name: string;
  active?: boolean;
  icon: string;
  iconOutline: string;
  mapIdle: string;
  mapSelected: string;
}

export enum SportsEnum {
  SOFTBALL = 1,
  BASKETBALL = 2,
  FOOTBALL = 3,
  SOCCER = 4,
  BOWLING = 5,
  BOCCEBALL = 6,
  CORNHOLE = 7,
  DODGEBALL = 8,
  FRISBEE = 9,
  HOCKEY = 10,
  KICKBALL = 11,
  LACROSSE = 12,
  PINGPONG = 13,
  RUGBY = 14,
  SKEEBALL = 15,
  TENNIS = 16,
  VOLLEYBALL = 17,
  WIFFLEBALL = 18,
  BADMINTON = 19,
  FITNESS = 20,
  GOLF = 21,
  PILATES = 22,
  RUNNING = 23,
  SKIING = 24,
  SNOWBOARDING = 25,
  YOGA = 26,
  BROOMBALL = 27,
  CRICKET = 28,
  CROSSFIT = 29,
  CYCLING = 30,
  FIELD_HOCKEY = 31,
  RACQUETBALL = 32,
  SPINNING = 33,
  SQUASH = 34,
  SURFING = 35,
  SWIMMING = 36,
  WIND_SURFING = 37,
  ADVENTURE = 38,
  BOXING = 39,
  BASEBALL = 40,
  DANCE = 41,
  KICKBOXING = 42,
  MARTIAL_ARTS = 43,
  OUTDOORS = 44,
  ROWING = 45,
  SAILING = 46,
  SUP = 47,
  TRIATHLON = 48,
  HANDBALL = 49,
  CATCHBALL = 50,
  BLITZBALL = 51,
  ROLLER_DERBY = 52,
  OTHER = 999
}


@Injectable()
export class SportsService {
  constructor() {}

  /**
   * Retrieve a sport object from the sports array
   * based on id or the sport name as a string
   * if nothing is found returns the multi sport by default
   * @param sport
   * @returns {undefined|RCSportItem}
   */
  getSport(sport: number | string): RCSportItem {
    if (!sport)
      return _.find<RCSportItem>(this.sports, (i) => i.name === "multi");

    if (typeof sport === "string") {
      return _.find<RCSportItem>(
        this.sports,
        (i) => i.name === sport.toLowerCase()
      );
    } else {
      return _.find<RCSportItem>(this.sports, (i) => i.id === Number(sport));
    }
  }

  /**
   * Retrieves the sport icon string
   * based on a sports array passed to the function
   * @param sports
   * @param outline
   * @returns {string}
   */
  getSportsIcon(sports: number[], outline?: boolean): string {
    let sport: RCSportItem;

    if (sports.length > 1 || !sports.length) {
      sport = this.getSport("multi");
    } else {
      sport = this.getSport(sports[0]);
    }

    return outline ? sport.iconOutline : sport.icon;
  }

  /**
   * Retreives the level of play as text
   * acts as a converter from Enum to readable text
   * @param id
   * @returns {any}
   */
  getLevelOfPlayText(id: number): string {
    let level;

    switch (id) {
      case 1:
        level = "Beginner";
        break;
      case 2:
        level = "Intermediate";
        break;
      case 3:
        level = "Advanced";
        break;
      case 4:
        level = "Semi-pro";
        break;
    }

    return level;
  }

  /**
   * Retrieves the map icon for a given sport item
   * if no sport found the multi icon returns
   * @param sports
   * @param type
   * @returns {string}
   */
  getMapIcon(sports: number[], type: "idle" | "selected"): string {
    let sport: RCSportItem;

    if (sports.length > 1 || !sports.length) {
      sport = this.getSport("multi");
    } else {
      sport = this.getSport(sports[0]);
    }

    if (!sport) return this.getSport("multi").mapIdle;

    if (type === "selected") return sport.mapSelected;

    return sport.mapIdle;
  }

  /**
   * Returns the entire sports list as a new array
   * @returns {RCSportItem}
   */
  getSports(): Array<RCSportItem> {
    return JSON.parse(JSON.stringify(this.sports.filter((i) => i.id !== 1000)));
  }

  private sports: Array<RCSportItem> = [
    {
      id: 3,
      name: "football",
      icon: "icon-icn-sport-football",
      iconOutline: "icon-outlineicn-sport-football",
      mapIdle: "Map_football_idle.png",
      mapSelected: "Map_football_selected.png",
    },
    {
      id: 2,
      name: "basketball",
      icon: "icon-icn-sport-basketball",
      iconOutline: "icon-outlineicn-sport-basketball",
      mapIdle: "Map_basketball_idle.png",
      mapSelected: "Map_basketball_selected.png",
    },
    {
      id: 4,
      name: "soccer",
      icon: "icon-icn-sport-soccer",
      iconOutline: "icon-outlineicn-sport-soccer",
      mapIdle: "Map_soccer_idle.png",
      mapSelected: "Map_soccer_selected.png",
    },
    {
      id: 10,
      name: "hockey",
      icon: "icon-icn-sport-hockey",
      iconOutline: "icon-outlineicn-sport-hockey",
      mapIdle: "Map_hockey_idle.png",
      mapSelected: "Map_hockey_selected.png",
    },
    {
      id: 17,
      name: "volleyball",
      icon: "icon-icn-sport-volleyball",
      iconOutline: "icon-outlineicn-sport-volleyball",
      mapIdle: "Map_volleyball_idle.png",
      mapSelected: "Map_volleyball_selected.png",
    },
    {
      id: 1,
      name: "softball",
      icon: "icon-icn-sport-baseball",
      iconOutline: "icon-outlineicn-sport-baseball",
      mapIdle: "Map_softball_idle.png",
      mapSelected: "Map_softball_selected.png",
    },
    {
      id: 40,
      name: "baseball",
      icon: "icon-icn-sport-baseball-2",
      iconOutline: "icon-outlineicn-outline-baseball-2",
      mapIdle: "Map_baseball_idle.png",
      mapSelected: "Map_baseball_selected.png",
    },
    {
      id: 16,
      name: "tennis",
      icon: "icon-icn-sport-tennis",
      iconOutline: "icon-outlineicn-sport-tennis",
      mapIdle: "Map_tennis_idle.png",
      mapSelected: "Map_tennis_selected.png",
    },
    {
      id: 11,
      name: "kickball",
      icon: "icon-icn-sport-kickball",
      iconOutline: "icon-outlineicn-sport-kickball",
      mapIdle: "Map_kickball_idle.png",
      mapSelected: "Map_kickball_selected.png",
    },
    {
      id: 8,
      name: "dodgeball",
      icon: "icon-icn-sport-dodgeball",
      iconOutline: "icon-outlineicn-sport-dodgeball",
      mapIdle: "Map_dodgeball_idle.png",
      mapSelected: "Map_dodgeball_selected.png",
    },
    {
      id: 14,
      name: "rugby",
      icon: "icon-icn-sport-rugby",
      iconOutline: "icon-outlineicn-sport-rugby",
      mapIdle: "Map_rugby_idle.png",
      mapSelected: "Map_rugby_selected.png",
    },

    {
      id: 9,
      name: "frisbee",
      icon: "icon-icn-sport-frisbee",
      iconOutline: "icon-outlineicn-sport-frisbee",
      mapIdle: "Map_frisbee_idle.png",
      mapSelected: "Map_frisbee_selected.png",
    },
    {
      id: 50,
      name: "catchball",
      icon: "icon-icn-sport-catchball",
      iconOutline: "icon-outlineicn-sport-catchball-outline",
      mapIdle: "Map_volleyball_idle.png",
      mapSelected: "Map_volleyball_selected.png",
    },

    {
      id: 5,
      name: "bowling",
      icon: "icon-icn-sport-bowling",
      iconOutline: "icon-outlineicn-sport-bowling",
      mapIdle: "Map_bowling_idle.png",
      mapSelected: "Map_bowling_selected.png",
    },
    {
      id: 13,
      name: "pingpong",
      icon: "icon-icn-sport-pingpong",
      iconOutline: "icon-outlineicn-sport-pingpong",
      mapIdle: "Map_pingpong_idle.png",
      mapSelected: "Map_pingpong_selected.png",
    },
    {
      id: 23,
      name: "running",
      icon: "icon-icn-sport-running",
      iconOutline: "icon-outlineicn-sport-running",
      mapIdle: "Map_running_idle.png",
      mapSelected: "Map_running_selected.png",
    },

    {
      id: 18,
      name: "wiffleball",
      icon: "icon-icn-sport-wiffle-ball",
      iconOutline: "icon-outlineicn-sport-wiffle-ball",
      mapIdle: "Map_wiffleball_idle.png",
      mapSelected: "Map_wiffleball_selected.png",
    },
    {
      id: 51,
      name: "blitzball",
      icon: "icon-icn-sport-blitzball",
      iconOutline: "icon-outlineicn-sport-blitzball-outline",
      mapIdle: "Map_handball_idle.png",
      mapSelected: "Map_handball_selected.png",
    },
    {
      id: 6,
      name: "bocceball",
      icon: "icon-icn-sport-bocce-ball",
      iconOutline: "icon-outlineicn-sport-bocce-ball",
      mapIdle: "Map_bocceball_idle.png",
      mapSelected: "Map_bocceball_selected.png",
    },
    {
      id: 15,
      name: "skeeball",
      icon: "icon-icn-sport-skeeball",
      iconOutline: "icon-outlineicn-sport-skeeball",
      mapIdle: "Map_skeeball_idle.png",
      mapSelected: "Map_skeeball_selected.png",
    },
    {
      id: 7,
      name: "cornhole",
      icon: "icon-icn-sport-cornhole",
      iconOutline: "icon-outlineicn-sport-cornhole",
      mapIdle: "Map_cornhole_idle.png",
      mapSelected: "Map_cornhole_selected.png",
    },
    {
      id: 12,
      name: "lacrosse",
      icon: "icon-icn-sport-lacrosse",
      iconOutline: "icon-outlineicn-sport-lacrosse",
      mapIdle: "Map_lacrosse_idle.png",
      mapSelected: "Map_lacrosse_selected.png",
    },
    {
      id: 19,
      name: "badminton",
      icon: "icon-icn-sport-badmington",
      iconOutline: "icon-outlineicn-sport-badmington",
      mapIdle: "Map_badminton_idle.png",
      mapSelected: "Map_badminton_selected.png",
    },
    {
      id: 20,
      name: "fitness",
      icon: "icon-icn-sport-fitness",
      iconOutline: "icon-outlineicn-sport-fitness",
      mapIdle: "Map_fitness_idle.png",
      mapSelected: "Map_fitness_selected.png",
    },
    {
      id: 21,
      name: "golf",
      icon: "icon-icn-sport-golf",
      iconOutline: "icon-outlineicn-sport-golf",
      mapIdle: "Map_golf_idle.png",
      mapSelected: "Map_golf_selected.png",
    },
    {
      id: 22,
      name: "pilates",
      icon: "icon-icn-sport-pilates",
      iconOutline: "icon-outlineicn-sport-pilates",
      mapIdle: "Map_pilates_idle.png",
      mapSelected: "Map_pilates_selected.png",
    },

    {
      id: 24,
      name: "skiing",
      icon: "icon-icn-sport-skiing",
      iconOutline: "icon-outlineicn-sport-skiing",
      mapIdle: "Map_ski_idle.png",
      mapSelected: "Map_ski_selected.png",
    },
    {
      id: 25,
      name: "snowboarding",
      icon: "icon-icn-sport-snowboard",
      iconOutline: "icon-outlineicn-sport-snowboard",
      mapIdle: "Map_snowboard_idle.png",
      mapSelected: "Map_snowboard_selected.png",
    },
    {
      id: 26,
      name: "yoga",
      icon: "icon-icn-sport-yoga",
      iconOutline: "icon-outlineicn-sport-yoga",
      mapIdle: "Map_yoga_idle.png",
      mapSelected: "Map_yoga_selected.png",
    },
    {
      id: 27,
      name: "broomball",
      icon: "icon-icn-sport-broomball",
      iconOutline: "icon-outlineicn-sport-broomball",
      mapIdle: "Map_broomball_idle.png",
      mapSelected: "Map_broomball_selected.png",
    },
    {
      id: 28,
      name: "cricket",
      icon: "icon-icn-sport-cricket",
      iconOutline: "icon-outlineicn-sport-cricket",
      mapIdle: "Map_cricket_idle.png",
      mapSelected: "Map_cricket_selected.png",
    },
    {
      id: 29,
      name: "crossfit",
      icon: "icon-icn-sport-crossfit",
      iconOutline: "icon-outlineicn-sport-crossfit",
      mapIdle: "Map_crossfit_idle.png",
      mapSelected: "Map_crossfit_selected.png",
    },
    {
      id: 30,
      name: "cycling",
      icon: "icon-icn-sport-cycling",
      iconOutline: "icon-outlineicn-sport-cycling",
      mapIdle: "Map_cycling_idle.png",
      mapSelected: "Map_cycling_selected.png",
    },
    {
      id: 31,
      name: "field-hockey",
      icon: "icon-icn-sport-field-hockey",
      iconOutline: "icon-outlineicn-sport-field-hockey",
      mapIdle: "Map_field_hockey_idle.png",
      mapSelected: "Map_field_hockey_selected.png",
    },
    {
      id: 32,
      name: "racquetball",
      icon: "icon-icn-sport-racquetball",
      iconOutline: "icon-outlineicn-sport-racquetball",
      mapIdle: "Map_racquetball_idle.png",
      mapSelected: "Map_racquetball_selected.png",
    },
    {
      id: 33,
      name: "spinning",
      icon: "icon-icn-sport-spining",
      iconOutline: "icon-outlineicn-sport-spining",
      mapIdle: "Map_spinning_idle.png",
      mapSelected: "Map_spinning_selected.png",
    },
    {
      id: 34,
      name: "squash",
      icon: "icon-icn-sport-squash",
      iconOutline: "icon-outlineicn-sport-squash",
      mapIdle: "Map_squash_idle.png",
      mapSelected: "Map_squash_selected.png",
    },
    {
      id: 35,
      name: "surfing",
      icon: "icon-icn-sport-surfing",
      iconOutline: "icon-outlineicn-sport-surfing",
      mapIdle: "Map_surfing_idle.png",
      mapSelected: "Map_surfing_selected.png",
    },
    {
      id: 36,
      name: "swimming",
      icon: "icon-icn-sport-swimming",
      iconOutline: "icon-outlineicn-sport-swimming",
      mapIdle: "Map_swimming_idle.png",
      mapSelected: "Map_swimming_selected.png",
    },
    {
      id: 37,
      name: "wind-surfing",
      icon: "icon-icn-sport-wind-surfing",
      iconOutline: "icon-outlineicn-sport-wind-surfing",
      mapIdle: "Map_wind_surfing_idle.png",
      mapSelected: "Map_wind_surfing_selected.png",
    },
    {
      id: 38,
      name: "adventure",
      icon: "icon-icn-sport-adventure",
      iconOutline: "icon-outlineicn-sport-adventure",
      mapIdle: "Map_adventure_idle.png",
      mapSelected: "Map_adventure_selected.png",
    },
    {
      id: 39,
      name: "boxing",
      icon: "icon-icn-sport-boxing",
      iconOutline: "icon-outlineicn-sport-boxing",
      mapIdle: "Map_boxing_idle.png",
      mapSelected: "Map_boxing_selected.png",
    },
    {
      id: 41,
      name: "dance",
      icon: "icon-icn-sport-dance",
      iconOutline: "icon-outlineicn-sport-dance",
      mapIdle: "Map_dance_idle.png",
      mapSelected: "Map_dance_selected.png",
    },
    {
      id: 42,
      name: "kickboxing",
      icon: "icon-icn-sport-kickboxing",
      iconOutline: "icon-outlineicn-sport-kickboxing",
      mapIdle: "Map_kickboxing_idle.png",
      mapSelected: "Map_kickboxing_selected.png",
    },
    {
      id: 43,
      name: "martial-arts",
      icon: "icon-icn-sport-martial-arts",
      iconOutline: "icon-outlineicn-sport-martial-arts",
      mapIdle: "Map_martial_arts_idle.png",
      mapSelected: "Map_martial_arts_selected.png",
    },
    {
      id: 44,
      name: "outdoors",
      icon: "icon-icn-sport-outdoors",
      iconOutline: "icon-outlineicn-sport-outdoors",
      mapIdle: "Map_outdoors_idle.png",
      mapSelected: "Map_outdoors_selected.png",
    },
    {
      id: 45,
      name: "rowing",
      icon: "icon-icn-sport-rowing",
      iconOutline: "icon-outlineicn-sport-rowing",
      mapIdle: "Map_rowing_idle.png",
      mapSelected: "Map_rowing_selected.png",
    },
    {
      id: 46,
      name: "sailing",
      icon: "icon-icn-sport-sailing",
      iconOutline: "icon-outlineicn-sport-sailing",
      mapIdle: "Map_sailing_idle.png",
      mapSelected: "Map_sailing_selected.png",
    },
    {
      id: 47,
      name: "sup",
      icon: "icon-icn-sport-sup",
      iconOutline: "icon-outlineicn-sport-sup",
      mapIdle: "Map_sup_idle.png",
      mapSelected: "Map_sup_selected.png",
    },
    {
      id: 48,
      name: "triathlon",
      icon: "icon-icn-sport-triathlon",
      iconOutline: "icon-outlineicn-sport-triathlon",
      mapIdle: "Map_triathlon_idle.png",
      mapSelected: "Map_triathlon_selected.png",
    },
    {
      id: 49,
      name: "handball",
      icon: "icon-icn-sport-handball",
      iconOutline: "icon-outlineicn-sport-handball",
      mapIdle: "Map_handball_idle.png",
      mapSelected: "Map_handball_selected.png",
    },
    {
      id: 52,
      name: "rollerderby",
      icon: "icon-icn-sport-roller-derby",
      iconOutline: "icon-outlineicn-sport-roller-derby-outline",
      mapIdle: "Map_volleyball_idle.png",
      mapSelected: "Map_volleyball_selected.png",
    },
    {
      id: 53,
      name: "ice-skating",
      icon: "icon-icn-sport-ice-skating",
      iconOutline: "icon-outlineicn-sport-ice-skating-outline",
      mapIdle: "Map_iceskating_idle.png",
      mapSelected: "Map_iceskating_selected.png",
    },
    {
      id: 999,
      name: "other",
      icon: "icon-icn-sport-multi",
      iconOutline: "icon-outlineicn-sport-multi",
      mapIdle: "map-single.png",
      mapSelected: "map-selected.png",
    },
    {
      id: 1000,
      name: "multi",
      icon: "icon-icn-sport-multi",
      iconOutline: "icon-outlineicn-sport-multi",
      mapIdle: "map-single.png",
      mapSelected: "map-selected.png",
    },
  ];
}
