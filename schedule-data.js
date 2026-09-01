/* ==========================================================================
   Shared class-schedule data — BSOAOUMN 2-7
   Single source of truth for index.html's dashboard teaser card AND
   schedule.html's full schedule view. Edit this ONE file when the term's
   dates, subjects, or instructors change; both pages read from it, so
   there's no more risk of the two copies drifting apart.

   Dates are plain ISO strings ('YYYY-MM-DD') compared against the
   visitor's own local date — no server clock needed.
   ========================================================================== */
var SCHEDULE = {
  cycle1: {
    label: 'Cycle 1',
    startsAt: '7:30 AM',
    dates: ['2026-09-12','2026-09-26','2026-10-10','2026-11-07','2026-11-21','2026-12-05'],
    classes: [
      { code:'GEED 033', time:'7:30\u201309:00 AM', instructor:'Sir Alvin Ortiz' },
      { code:'GEED 003', time:'9:00\u201310:30 AM', instructor:'Sir Joringer Rangpas' },
      { code:'ENGL 017', time:'10:30 AM\u201312:00 NN', instructor:'Ma\u2019am Helen Oris' },
      { code:'OFAD 202', time:'12:00 NN\u20131:30 PM', instructor:'Ma\u2019am Arlene Garcia' }
    ]
  },
  cycle2: {
    label: 'Cycle 2',
    startsAt: '1:30 PM',
    dates: ['2026-09-05','2026-09-19','2026-10-03','2026-10-24','2026-11-14','2026-12-12'],
    classes: [
      { code:'OFAD 201', time:'1:30\u20133:00 PM', instructor:'Sir Lambert Louise Loleng' },
      { code:'OFAD 203', time:'3:00\u20134:30 PM', instructor:'Sir Jonathan Florida' },
      { code:'PATHFIT 3', time:'6:00\u20137:30 PM', instructor:'Sir Mark Villarba' }
    ]
  },
  /* No day/time slot has been set for this subject yet. It has no
     `dates`, so it's deliberately left out of the today/upcoming status
     logic below — it just gets its own "To Be Announced" listing on
     schedule.html until a real slot is confirmed. */
  tba: {
    label: 'To Be Announced',
    classes: [
      { code:'MARK001', time:'TBA', instructor:'TBA' }
    ]
  }
};

/* Cycle keys that actually carry dates — used anywhere we need to loop
   over "real" scheduled cycles without tripping on `tba`. */
var SCHEDULE_DATED_CYCLES = ['cycle1', 'cycle2'];

function scheduleTodayISO(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function scheduleParseISO(iso){
  var p = iso.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function scheduleFormatPretty(iso){
  return scheduleParseISO(iso).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
}
function scheduleFormatShort(iso){
  return scheduleParseISO(iso).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}
function scheduleGetStatus(){
  var today = scheduleTodayISO();
  for (var i = 0; i < SCHEDULE_DATED_CYCLES.length; i++){
    var key = SCHEDULE_DATED_CYCLES[i];
    if (SCHEDULE[key].dates.indexOf(today) !== -1) return { when:'today', cycleKey:key, date:today };
  }
  var upcoming = [];
  SCHEDULE_DATED_CYCLES.forEach(function(key){
    SCHEDULE[key].dates.forEach(function(dt){ if (dt >= today) upcoming.push({ cycleKey:key, date:dt }); });
  });
  upcoming.sort(function(a, b){ return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });
  if (upcoming.length) return { when:'upcoming', cycleKey:upcoming[0].cycleKey, date:upcoming[0].date };
  return { when:'none' };
}
