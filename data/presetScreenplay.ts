import { ArtStyle, CharacterProfile, SceneDetail } from '../types';

export const GLOBAL_CHARACTER_LOCK_PRESET = `Emma, 35, realistic American woman, shoulder-length dark brown hair, expressive hazel eyes, elegant but modest appearance; Lily, 8, small girl with long dark brown hair, innocent expressive eyes; Michael and Daniel, identical 38-year-old twin brothers, short dark hair, light stubble, same facial structure, realistic cinematic appearance. Premium cinematic human drama, photorealistic, natural skin texture, realistic emotions, subtle film grain, moody warm-neutral color grading, shallow depth of field, realistic environments, no text, no subtitles, 16:9.`;

export const PRESET_CHARACTERS: CharacterProfile[] = [
  {
    name: "Emma",
    role: "Mother & Protagonist",
    age: 35,
    description: "Realistic American woman, shoulder-length dark brown hair, expressive hazel eyes, elegant but modest appearance, carrying the weight of 7 years of grief.",
    traits: "Shoulder-length dark brown hair, expressive hazel eyes, natural skin texture, modest elegance",
    locked: true,
    imagePrompt: "Photorealistic portrait of Emma, 35-year-old American woman, shoulder-length dark brown hair, expressive hazel eyes, natural skin texture, subtle film grain, elegant modest clothing, realistic cinematic lighting, shallow depth of field, 16:9, no text, no subtitles."
  },
  {
    name: "Lily",
    role: "Daughter (8 years old)",
    age: 8,
    description: "Small girl with long dark brown hair, innocent and deeply expressive eyes, remembers her father despite the passage of time.",
    traits: "Long dark brown hair, innocent expressive eyes, childlike curiosity and certainty",
    locked: true,
    imagePrompt: "Photorealistic cinematic portrait of Lily, 8-year-old girl, long dark brown hair, innocent expressive eyes, natural skin texture, photorealistic human drama, subtle film grain, soft warm-neutral lighting, shallow depth of field, 16:9."
  },
  {
    name: "Daniel",
    role: "Missing Husband (Identical Twin)",
    age: 38,
    description: "Identical twin brother to Michael, short dark hair, light stubble, sharp facial structure, vanished 7 years ago under mysterious circumstances.",
    traits: "Identical twin to Michael, short dark hair, light stubble, guarded intense eyes",
    locked: true,
    imagePrompt: "Photorealistic cinematic portrait of Daniel, 38-year-old man, short dark hair, light stubble, identical twin facial structure, mysterious guarded demeanor, natural skin texture, moody warm-neutral color grading, shallow depth of field, 16:9."
  },
  {
    name: "Michael",
    role: "Secret Twin Brother",
    age: 38,
    description: "Daniel's identical twin brother, identical facial structure with short dark hair and light stubble, but visibly older, tired, and more guarded.",
    traits: "Identical twin to Daniel, short dark hair, light stubble, weary guarded expression",
    locked: true,
    imagePrompt: "Photorealistic cinematic portrait of Michael, 38-year-old man, identical twin to Daniel, short dark hair, light stubble, tired guarded expression, natural skin texture, subtle film grain, moody warm-neutral color grading, shallow depth of field, 16:9."
  }
];

const RAW_PRESET_SCENES: SceneDetail[] = [
  {
    sceneNumber: 1,
    timestamp: "00:00–00:08",
    narrativeDescription: "Emma and Lily walking home on a quiet suburban street at sunset. Lily suddenly stops and points across the street at a mysterious man standing beside a parked black car. Emma turns toward him in confusion.",
    videoPrompt: "Emma and Lily walking home on a quiet suburban street at sunset, Lily suddenly stops and points across the street at a mysterious man standing beside a parked black car, Emma turns toward him in confusion, cinematic realism, slow push-in camera, emotional tension, realistic body language, natural sunset lighting, shallow depth of field, 16:9, photorealistic, no text",
    imagePrompt: "Cinematic film still, 16:9. Emma and Lily walking along quiet suburban sidewalk at golden sunset. Lily halts abruptly pointing at a shadowed man beside a glossy black sedan across the road. Slow push-in framing, emotional tension, warm-neutral golden hour grading, photorealistic, subtle film grain, no text.",
    voicePrompt: "Young girl whispers with sudden fear and certainty, “Mom… that’s my father.”",
    cameraAngle: "Slow push-in camera, eye-level street perspective",
    lighting: "Natural sunset golden hour lighting with long warm shadows",
    timeOfDay: "Sunset (Golden Hour)",
    visualStyle: "Premium cinematic human drama, subtle film grain, 16:9",
    transition: "Smash cut on spoken line to extreme close-up",
    directorNotes: "Subtle handheld breathing motion on Emma and Lily. Keep the shadowed figure across the street silhouetted beside the sedan to build early psychological suspense before revealing identity.",
    characters: ["Emma", "Lily", "Daniel"]
  },
  {
    sceneNumber: 2,
    timestamp: "00:08–00:16",
    narrativeDescription: "Extreme close-up of Emma's face as her expression changes from confusion to shock, her breathing stops, her eyes locked on the distant man who slowly turns away.",
    videoPrompt: "Extreme close-up of Emma's face as her expression changes from confusion to shock, her breathing stops, her eyes locked on the distant man who slowly turns away, handheld cinematic camera with subtle trembling movement, dramatic rack focus, photorealistic, natural skin texture, 16:9",
    imagePrompt: "Extreme close-up of Emma (35), expressive hazel eyes widening in disbelief, breath catching, rack focus shifting from her trembling face to distant blurry figure across street, handheld cinematic camera, subtle film grain, warm sunset rim light, 16:9.",
    voicePrompt: "Female voice, restrained shock, “Lily… your father died seven years ago.”",
    cameraAngle: "Extreme close-up, subtle handheld trembling, dramatic rack focus",
    lighting: "Warm sunset backlight with shadowed facial contrast",
    timeOfDay: "Sunset",
    visualStyle: "Photorealistic human drama, natural skin texture, shallow depth of field",
    transition: "Rack focus cut to street perspective",
    directorNotes: "Extreme macro focus on trembling lip and hazel eyes. Hold two beats of complete silence before Emma delivers her line to emphasize disbelief.",
    characters: ["Emma"]
  },
  {
    sceneNumber: 3,
    timestamp: "00:16–00:24",
    narrativeDescription: "The mysterious man walks quickly toward his black car without looking back, Emma takes one step forward while Lily watches him intensely.",
    videoPrompt: "The mysterious man walks quickly toward his black car without looking back, Emma takes one step forward while Lily watches him intensely, camera tracks backward in front of Emma, tense cinematic atmosphere, photorealistic, natural skin texture, 16:9",
    imagePrompt: "Cinematic shot tracking backward in front of Emma and Lily. The mysterious figure in dark jacket reaches the door of his black car across the asphalt. Lily watches with fierce conviction, Emma frozen mid-step. Tense atmosphere, twilight sunset, 16:9.",
    voicePrompt: "Little girl speaks urgently, “No, Mom. I know his face.”",
    cameraAngle: "Camera tracks backward in front of Emma and Lily",
    lighting: "Deepening dusk ambient glow, headlight glints",
    timeOfDay: "Dusk",
    visualStyle: "Premium cinematic human drama, moody warm-neutral tone",
    transition: "Hard cut to car acceleration",
    directorNotes: "Lily's gaze must never leave the figure. Sound design: muffled car door latch closing with heavy bass thump.",
    characters: ["Emma", "Lily", "Daniel"]
  },
  {
    sceneNumber: 4,
    timestamp: "00:24–00:32",
    narrativeDescription: "Emma rushes toward the street, but the black car accelerates away around the corner, she stops helplessly.",
    videoPrompt: "Emma rushes toward the street, but the black car accelerates away around the corner, she stops helplessly, camera follows the car then whip-pans back to Emma and Lily, realistic urban ambience, cinematic realism, 16:9",
    imagePrompt: "Emma running to curb edge as the black sedan screeches around corner, red taillights blurring. Whip-pan framing back to Emma holding Lily close, helpless and shaken under streetlamp glow. Subtle film grain, 16:9.",
    voicePrompt: "Female narration, tense and emotional, “For seven years, Emma had believed Daniel was dead.”",
    cameraAngle: "Follows fleeing car then whip-pans back to Emma and Lily",
    lighting: "Suburban dusk streetlights casting amber circles on pavement",
    timeOfDay: "Dusk / Twilight",
    visualStyle: "Cinematic motion blur, realistic urban ambience, shallow depth of field",
    transition: "Slow fade to black, night transition",
    directorNotes: "Whip-pan motion blur with screeching tires and amber lens flares. Cut to black on the final lingering shot of Emma clutching Lily tightly.",
    characters: ["Emma", "Lily"]
  },
  {
    sceneNumber: 5,
    timestamp: "00:32–00:40",
    narrativeDescription: "Nighttime inside Emma's dimly lit bedroom, she opens an old wooden box containing Daniel's wedding ring, photographs, and an obituary.",
    videoPrompt: "Nighttime inside Emma's dimly lit bedroom, she opens an old wooden box containing Daniel's wedding ring, photographs, and an obituary, warm bedside lamp illuminating her trembling hands, slow overhead camera movement, cinematic realism, 16:9",
    imagePrompt: "Dimly lit intimate bedroom at night. Emma's trembling fingers open an antique wooden keepsake box on the bed quilt. Inside lies a gold wedding band, yellowed obituary clipping, and family photo. Warm bedside lamp glow, overhead camera angle, film grain, 16:9.",
    voicePrompt: "Female narration, quiet and suspicious, “But that night, one impossible question kept her awake.”",
    cameraAngle: "Slow overhead downward camera movement",
    lighting: "Warm single bedside lamp illuminating hands, moody low-key shadows",
    timeOfDay: "Night",
    visualStyle: "Moody warm-neutral color grading, intimate low-key cinematic",
    transition: "Cross dissolve to hallway corridor",
    characters: ["Emma"]
  },
  {
    sceneNumber: 6,
    timestamp: "00:40–00:48",
    narrativeDescription: "A mysterious envelope slides beneath Emma's front door, she notices it while standing in the hallway, slowly picks it up, no sender name visible.",
    videoPrompt: "A mysterious envelope slides beneath Emma's front door, she notices it while standing in the hallway, slowly picks it up, no sender name visible, camera moves from the envelope to her nervous face, cinematic suspense, 16:9",
    imagePrompt: "Low-angle perspective down dark entryway hallway. A thick unmarked manila envelope slides under front door gap onto hardwood. Emma approaches cautiously in socks, crouching down. Camera tilts upward toward her apprehensive face, moody practical shadows, 16:9.",
    voicePrompt: "Female voice, low and uneasy, “Then someone left her a message.”",
    cameraAngle: "Low tilt-up camera moving from envelope on floor to nervous face",
    lighting: "Dim hallway light, moody shadows, blue moonlight creeping through transom",
    timeOfDay: "Night",
    visualStyle: "Suspenseful psychological drama, high dynamic range shadows",
    transition: "Match cut on envelope opening",
    characters: ["Emma"]
  },
  {
    sceneNumber: 7,
    timestamp: "00:48–00:56",
    narrativeDescription: "Close-up of Emma opening the envelope and pulling out an old photograph showing Emma and Daniel together years earlier, handwritten message visible but not readable.",
    videoPrompt: "Close-up of Emma opening the envelope and pulling out an old photograph showing Emma and Daniel together years earlier, handwritten message visible but not readable, her hands begin shaking, macro cinematic focus, 16:9",
    imagePrompt: "Macro close-up shot. Trembling female hands carefully slide a vintage glossy photograph from the unsealed envelope. The photo shows Emma and young Daniel smiling together years prior. Unreadable scrawled pen ink along the white border. Tactile textures, cinematic film grain, 16:9.",
    voicePrompt: "Female narration, suspenseful whisper, “You were never supposed to find out.”",
    cameraAngle: "Macro cinematic close-up on hands and photograph",
    lighting: "Warm focused practical lamp illumination highlighting paper texture",
    timeOfDay: "Night",
    visualStyle: "Tactile macro realism, shallow depth of field",
    transition: "Macro push cut to desk lamp",
    characters: ["Emma"]
  },
  {
    sceneNumber: 8,
    timestamp: "00:56–01:04",
    narrativeDescription: "Emma studies the photograph under a single lamp, notices a small unfamiliar man standing blurred in the distant background, camera slowly pushes toward the background figure.",
    videoPrompt: "Emma studies the photograph under a single lamp, notices a small unfamiliar man standing blurred in the distant background, camera slowly pushes toward the background figure, Emma's eyes widen, cinematic tension, 16:9",
    imagePrompt: "Emma under a single downward desk lamp, holding magnifying glass over the photograph. In the blurred background of the old photo, an eerie second figure watches them. Camera pushes past her shoulder into the grainy details of the print as Emma's hazel eyes widen in shock, 16:9.",
    voicePrompt: "Female voice, confused, “Who is that?”",
    cameraAngle: "Slow push toward blurred background figure in photograph, then Emma's widening eyes",
    lighting: "Single directional desk lamp, deep black background",
    timeOfDay: "Night",
    visualStyle: "Moody chiaroscuro lighting, subtle film grain",
    transition: "Smash cut to drawer searching",
    characters: ["Emma"]
  },
  {
    sceneNumber: 9,
    timestamp: "01:04–01:12",
    narrativeDescription: "Emma searches through an old family drawer and finds another photograph of Daniel standing beside an identical-looking man, she compares both faces under the light.",
    videoPrompt: "Emma searches through an old family drawer and finds another photograph of Daniel standing beside an identical-looking man, she compares both faces under the light, slow lateral camera movement, 16:9, cinematic realism",
    imagePrompt: "Messy wooden desk drawer pulled open. Emma holds two photographs side by side under the lamp: one of Daniel, the other showing Daniel with an identical twin brother standing shoulder to shoulder. Slow lateral tracking shot across both portraits, jaw-dropping realization, 16:9.",
    voicePrompt: "Female narration, increasingly alarmed, “The face beside Daniel was exactly the same.”",
    cameraAngle: "Slow lateral camera slide across the two comparative photographs",
    lighting: "Warm tungsten desk lamp, high contrast shadows",
    timeOfDay: "Late Night",
    visualStyle: "Warm-neutral cinematic drama, sharp documentary precision",
    transition: "Fade to morning car driving",
    characters: ["Emma"]
  },
  {
    sceneNumber: 10,
    timestamp: "01:12–01:20",
    narrativeDescription: "Morning, Emma drives through the city following a handwritten address from the envelope, her eyes repeatedly checking the rearview mirror.",
    videoPrompt: "Morning, Emma drives through the city following a handwritten address from the envelope, her eyes repeatedly checking the rearview mirror, cinematic car interior, camera mounted near passenger seat with subtle vibration, realistic lighting, 16:9",
    imagePrompt: "Interior of moving car in early morning city traffic. Emma behind steering wheel with tense posture, glancing repeatedly into rearview mirror. A crumpled slip of paper with an address rests on passenger seat. Camera mounted on dashboard with subtle engine vibration, overcast daylight, 16:9.",
    voicePrompt: "Female narration, determined but frightened, “The address led her to a building she had never seen before.”",
    cameraAngle: "Passenger seat dashboard-mounted cinematic angle",
    lighting: "Overcast morning natural daylight through car windshield and side glass",
    timeOfDay: "Morning",
    visualStyle: "Cinematic realism, subtle camera vibration, moody overcast city palette",
    transition: "Hard cut to building entrance",
    characters: ["Emma"]
  },
  {
    sceneNumber: 11,
    timestamp: "01:20–01:28",
    narrativeDescription: "Emma enters an abandoned-looking apartment building, narrow hallway with flickering lights, she slowly walks forward while hearing a man's voice behind a closed door.",
    videoPrompt: "Emma enters an abandoned-looking apartment building, narrow hallway with flickering lights, she slowly walks forward while hearing a man's voice behind a closed door, camera tracks beside her, atmospheric cinematic tension, 16:9",
    imagePrompt: "Narrow dingy apartment corridor with peeling wallpaper and worn carpet. Flourescent ceiling fixture flickering erratically. Emma walking cautiously toward a weathered wooden door at the hallway end. Camera tracking laterally with her footsteps, moody atmospheric haze, 16:9.",
    voicePrompt: "Male voice from behind the door, calm and mysterious, “She still believes Daniel is dead.”",
    cameraAngle: "Lateral tracking shot gliding parallel to Emma's cautious movement",
    lighting: "Flickering sickly fluorescent corridor tubes, heavy vignette",
    timeOfDay: "Daytime",
    visualStyle: "Gritty cinematic drama, shallow depth of field, subtle film grain",
    transition: "Slow push cut to door handle",
    characters: ["Emma"]
  },
  {
    sceneNumber: 12,
    timestamp: "01:28–01:36",
    narrativeDescription: "Emma freezes outside the door, her hand hovering above the handle, then slowly opens it to reveal Michael standing in a dim apartment, identical to Daniel but older and more guarded.",
    videoPrompt: "Emma freezes outside the door, her hand hovering above the handle, then slowly opens it to reveal Michael standing in a dim apartment, identical to Daniel but older and more guarded, slow dramatic reveal camera, 16:9",
    imagePrompt: "Slow dramatic reveal through slowly creaking apartment door. Inside dim dusty living room stands Michael (38), identical twin to Daniel, short dark hair, light stubble, but wearing a weathered coat with wary posture. Emma stands frozen on threshold in utter disbelief, 16:9.",
    voicePrompt: "Female voice, trembling disbelief, “Daniel?”",
    cameraAngle: "Slow dramatic reveal shot moving past doorframe into apartment",
    lighting: "Soft murky daylight piercing through dirty venetian blinds",
    timeOfDay: "Daytime",
    visualStyle: "High-contrast cinematic mystery, photorealistic human faces",
    transition: "Dramatic rack focus cut",
    directorNotes: "Crucial revelation beat. Michael's posture should express deep weariness and remorse rather than menace. Keep dust motes suspended in the murky daylight beam.",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 13,
    timestamp: "01:36–01:44",
    narrativeDescription: "Michael looks at Emma with sadness but does not approach her, Emma stares at him searching his face, tense silence, alternating close-ups.",
    videoPrompt: "Michael looks at Emma with sadness but does not approach her, Emma stares at him searching his face, tense silence, alternating close-ups, cinematic shallow depth of field, photorealistic, 16:9",
    imagePrompt: "Alternating shot-reverse-shot close-ups. Michael's face etched with sorrow and exhaustion, eyes locked onto Emma. Emma searching every scar, stubble line, and eyelid for the man she buried. Shallow depth of field, subtle dust motes in room air, 16:9.",
    voicePrompt: "Male voice, controlled and emotional, “No. My name is Michael.”",
    cameraAngle: "Alternating shot/reverse-shot close-ups with shallow focus",
    lighting: "Diffused window side-lighting carving facial contours",
    timeOfDay: "Daytime",
    visualStyle: "Raw emotional photorealism, natural skin texture, 35mm film aesthetic",
    transition: "Slow circular dolly cut to photograph on table",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 14,
    timestamp: "01:44–01:52",
    narrativeDescription: "Emma steps backward in disbelief while Michael places an old photograph on the table showing himself and Daniel as children, camera slowly circles both characters.",
    videoPrompt: "Emma steps backward in disbelief while Michael places an old photograph on the table showing himself and Daniel as children, camera slowly circles both characters, dramatic warm practical lighting, 16:9",
    imagePrompt: "Slow 360-degree orbital camera move around a weathered oak coffee table. Michael gently sets down a framed silver-gelatin photograph showing twin boys around age 10 in matching sweaters. Emma clutches her coat, stepping back in vertigo, warm lamp glow, 16:9.",
    voicePrompt: "Male voice, quiet revelation, “Daniel was my twin brother.”",
    cameraAngle: "Slow 360-degree orbital camera circle around both characters",
    lighting: "Warm practical floor lamp creating circular amber pool of light",
    timeOfDay: "Daytime",
    visualStyle: "Intimate cinematic drama, smooth camera stabilization",
    transition: "Dissolve into 7-year flashback montage",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 15,
    timestamp: "01:52–02:00",
    narrativeDescription: "Rapid cinematic flashback montage of Daniel secretly leaving home, changing clothes, meeting an unknown man, and disappearing into the night seven years earlier.",
    videoPrompt: "Rapid cinematic flashback montage of Daniel secretly leaving home, changing clothes, meeting an unknown man, and disappearing into the night seven years earlier, desaturated memory style, fast controlled camera movements, 16:9",
    imagePrompt: "Stylized memory flashback montage. Daniel seven years younger stuffing a dark duffel bag in a midnight rainstorm, throwing on a black trench coat, meeting an ominous shadow in an industrial alley, disappearing into a waiting car. Desaturated monochrome tones, film grain, 16:9.",
    voicePrompt: "Male narration, serious and restrained, “But Daniel didn't die that night. He disappeared.”",
    cameraAngle: "Dynamic montage cutting, fast handheld tracking shots",
    lighting: "Desaturated cool blues, high contrast shadows and slick rain reflections",
    timeOfDay: "Night (Flashback 7 Years Ago)",
    visualStyle: "Noir memory flashback, desaturated palette, gritty grain",
    transition: "Smash cut back to present apartment confrontation",
    characters: ["Daniel"]
  },
  {
    sceneNumber: 16,
    timestamp: "02:00–02:08",
    narrativeDescription: "Emma confronts Michael, tears forming but anger controlling her face, Michael avoids eye contact and looks toward the window, tense two-shot.",
    videoPrompt: "Emma confronts Michael, tears forming but anger controlling her face, Michael avoids eye contact and looks toward the window, tense two-shot with slow dolly movement, cinematic realism, 16:9",
    imagePrompt: "Tense two-shot. Emma leaning in with tear-filled eyes ablaze with fury, demanding truth. Michael turning his profile toward the grey rain-streaked window, jaw clenched with guilt. Slow dolly-in compressing distance, 16:9.",
    voicePrompt: "Female voice, hurt and angry, “Why would he let me believe he was dead?”",
    cameraAngle: "Tense cinematic two-shot with slow continuous dolly forward",
    lighting: "Cool exterior window light hitting Michael, warm interior lamp on Emma",
    timeOfDay: "Daytime",
    visualStyle: "Photorealistic human drama, intense facial micro-expressions",
    transition: "J-cut to rustling documents",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 17,
    timestamp: "02:08–02:16",
    narrativeDescription: "Michael slowly reveals an old file containing financial documents and photographs, Emma looks through them and realizes Daniel had been involved in serious fraud.",
    videoPrompt: "Michael slowly reveals an old file containing financial documents and photographs, Emma looks through them and realizes Daniel had been involved in serious fraud, camera pushes toward her shocked expression, 16:9",
    imagePrompt: "Michael slides open an accordion file folder across the table. Stacks of audited bank ledgers, offshore wire receipts, and surveillance photos spread out. Emma flips through in horror as the fraudulent conspiracy dawns on her. Slow camera push-in to her stricken face, 16:9.",
    voicePrompt: "Male voice, heavy and cautious, “Because you were about to expose everything he had done.”",
    cameraAngle: "Downward push-in tracking Emma's hands on documents up to her eyes",
    lighting: "Harsh overhead tungsten bulb casting dramatic shadows under brow",
    timeOfDay: "Daytime",
    visualStyle: "Investigative thriller aesthetic, sharp photographic detail",
    transition: "Crash zoom match cut to surveillance photo",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 18,
    timestamp: "02:16–02:24",
    narrativeDescription: "Close-up of Emma discovering a recent photograph of Lily inside the file, taken from a distance outside her school, her expression instantly changes from anger to fear.",
    videoPrompt: "Close-up of Emma discovering a recent photograph of Lily inside the file, taken from a distance outside her school, her expression instantly changes from anger to fear, camera rapidly pushes in, 16:9",
    imagePrompt: "Rapid push-in camera to extreme close-up. Emma's trembling fingers lift a 4x6 telephoto surveillance photo of 8-year-old Lily in her yellow school backpack walking by playground fence, taken only days ago. All color drains from Emma's face in sheer maternal panic, 16:9.",
    voicePrompt: "Female voice, frightened whisper, “He has been watching Lily?”",
    cameraAngle: "Rapid crash push-in to extreme close-up of Emma's terrified eyes",
    lighting: "High-contrast clinical light emphasizing pale skin tone and dilated pupils",
    timeOfDay: "Daytime",
    visualStyle: "Visceral suspense, heightened contrast, intense macro focus",
    transition: "Hard cut to glowing burner phone",
    characters: ["Emma"]
  },
  {
    sceneNumber: 19,
    timestamp: "02:24–02:32",
    narrativeDescription: "Michael looks directly into Emma's eyes, then reveals a small phone containing a recent message from Daniel, Emma stares at the screen in disbelief.",
    videoPrompt: "Michael looks directly into Emma's eyes, then reveals a small phone containing a recent message from Daniel, Emma stares at the screen in disbelief, slow dramatic camera orbit, 16:9",
    imagePrompt: "Dramatic orbit shot. Michael meets Emma's gaze with sobering gravity, pulling a black burner smartphone from his coat and turning the illuminated screen toward her. The blue digital glow paints their faces in dark room, 16:9.",
    voicePrompt: "Male voice, grave and quiet, “He never stopped watching you.”",
    cameraAngle: "Slow dramatic camera orbit pivoting between Michael and Emma",
    lighting: "Subdued room ambience with vivid cyan phone screen bounce light on faces",
    timeOfDay: "Late Afternoon",
    visualStyle: "Techno-noir thriller edge within realistic human drama",
    transition: "Over-the-shoulder push cut",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 20,
    timestamp: "02:32–02:40",
    narrativeDescription: "Emma grabs the phone and reads the latest message, her hands shaking, camera moves over her shoulder toward the glowing screen without showing readable text.",
    videoPrompt: "Emma grabs the phone and reads the latest message, her hands shaking, camera moves over her shoulder toward the glowing screen without showing readable text, suspenseful lighting, 16:9",
    imagePrompt: "Over-the-shoulder suspense shot. Emma's trembling hands grip the burner phone tightly. The screen casts a stark luminescence over her knuckles and face. The camera pushes slowly past her shoulder toward the mysterious glowing interface. 16:9.",
    voicePrompt: "Female voice, barely audible, “Where is Daniel?”",
    cameraAngle: "Over-the-shoulder creeping push toward phone and Emma's profile",
    lighting: "Phone screen as primary key light, deep vignette shadows",
    timeOfDay: "Late Afternoon / Dusk",
    visualStyle: "Psychological suspense, shallow depth of field, 16:9",
    transition: "Suspenseful audio J-cut to exterior corridor footsteps",
    characters: ["Emma"]
  },
  {
    sceneNumber: 21,
    timestamp: "02:40–02:48",
    narrativeDescription: "Michael looks toward the apartment doorway as a faint sound comes from the hallway, Emma turns slowly, both characters suddenly alert, camera pulls backward into the dark corridor.",
    videoPrompt: "Michael looks toward the apartment doorway as a faint sound comes from the hallway, Emma turns slowly, both characters suddenly alert, camera pulls backward into the dark corridor, 16:9",
    imagePrompt: "Low-angle reverse tracking shot pulling backward out of the apartment into the pitch-black corridor. Emma and Michael stand rigid in the doorway light, heads snapping toward the creaking floorboards outside. Chilling dread, 16:9.",
    voicePrompt: "Michael whispers with fear, “He's closer than you think.”",
    cameraAngle: "Camera pulls backward from doorway deep into pitch-black hallway",
    lighting: "Silhouette doorway edge-light cutting into ominous dark hallway",
    timeOfDay: "Dusk / Nightfall",
    visualStyle: "Masterful cinematic suspense, wide dynamic range, deep blacks",
    transition: "Fade to night exterior, returning home",
    characters: ["Emma", "Michael"]
  },
  {
    sceneNumber: 22,
    timestamp: "02:48–02:56",
    narrativeDescription: "Emma returns home at night and finds Lily standing silently near the living-room window, Lily looks toward the front door as footsteps approach outside.",
    videoPrompt: "Emma returns home at night and finds Lily standing silently near the living-room window, Lily looks toward the front door as footsteps approach outside, camera slowly moves behind them toward the doorway, 16:9",
    imagePrompt: "Emma's home living room at night. 8-year-old Lily stands motionless beside the sheer lace curtains, staring transfixed at the wooden front door. Slow creeping camera gliding behind mother and daughter as heavy slow bootsteps crunch on the front porch steps, 16:9.",
    voicePrompt: "Lily whispers with certainty, “Mom… he's here.”",
    cameraAngle: "Slow forward creeping camera from behind Emma and Lily toward front door",
    lighting: "Pale moonlight through window mixed with porch amber door spill",
    timeOfDay: "Night",
    visualStyle: "Pure cinematic dread, atmospheric lighting, photorealistic interior",
    transition: "Slow creeping cut to exterior porch handle",
    characters: ["Emma", "Lily"]
  },
  {
    sceneNumber: 23,
    timestamp: "02:56–03:00",
    narrativeDescription: "The front door slowly opens, only a mysterious man's hand appears holding an old photograph of Emma, camera rapidly pushes toward the photograph before cutting to black.",
    videoPrompt: "The front door slowly opens, only a mysterious man's hand appears holding an old photograph of Emma, camera rapidly pushes toward the photograph before cutting to black, intense cinematic sound design, unresolved mystery, 16:9",
    imagePrompt: "Front door hinges creaking inward into dark foyer. Only a man's masculine hand with light stubble on wrist extends forward, holding the vintage photograph of young smiling Emma. Camera crashes in violently on the photograph right before snapping to pitch black. 16:9.",
    voicePrompt: "Deep male whisper, chilling and emotional, “You finally found me.”",
    cameraAngle: "Rapid violent push-in toward hand holding photo, hard cut to black",
    lighting: "Harsh streetlamp backlight silhouetting the opening door",
    timeOfDay: "Night (Final Shot / Climax)",
    visualStyle: "Cliffhanger thriller climax, intense cinematic resolution, 16:9",
    transition: "Hard cut to black (Climax / Unresolved Mystery)",
    directorNotes: "Final cliffhanger frame: The man's wrist must reveal Daniel's antique leather watch band. Cut violently to black on the word 'me' with abrupt audio cutoff.",
    characters: ["Daniel"]
  }
];

const DEFAULT_PRESET_TAGS: Record<number, string[]> = {
  1: ["Tension", "Opening", "Suspense"],
  2: ["Emotional", "Tension", "Close-Up"],
  3: ["Action", "Suspense", "Exterior"],
  4: ["Action", "Tension", "Vehicle"],
  5: ["Flashback", "Mystery", "Night"],
  6: ["Flashback", "Memory", "Emotional"],
  7: ["Mystery", "Investigation"],
  8: ["Investigation", "Dialogue"],
  9: ["Suspense", "Investigation"],
  10: ["Tension", "Action"],
  11: ["Suspense", "Mystery"],
  12: ["Twist", "Tension", "Revelation"],
  13: ["Dialogue", "Emotional", "Tension"],
  14: ["Dialogue", "Revelation"],
  15: ["Flashback", "Action", "Secret"],
  16: ["Flashback", "Mystery"],
  17: ["Emotional", "Dialogue"],
  18: ["Tension", "Suspense"],
  19: ["Investigation", "Mystery"],
  20: ["Action", "Tension"],
  21: ["Dialogue", "Resolution"],
  22: ["Suspense", "Tension", "Night"],
  23: ["Climax", "Action", "Cliffhanger", "Tension"]
};

export const PRESET_SCENES: SceneDetail[] = RAW_PRESET_SCENES.map(s => ({
  ...s,
  duration: s.duration || (s.sceneNumber === 23 ? 4 : 8),
  tags: s.tags || DEFAULT_PRESET_TAGS[s.sceneNumber] || ["Drama"]
}));

export const PRESET_STORY_TEXT = `GLOBAL CHARACTER LOCK — Apply to every scene: Emma, 35, realistic American woman, shoulder-length dark brown hair, expressive hazel eyes, elegant but modest appearance; Lily, 8, small girl with long dark brown hair, innocent expressive eyes; Michael and Daniel, identical 38-year-old twin brothers, short dark hair, light stubble, same facial structure, realistic cinematic appearance. Premium cinematic human drama, photorealistic, natural skin texture, realistic emotions, subtle film grain, moody warm-neutral color grading, shallow depth of field, realistic environments, no text, no subtitles, 16:9.

SCENE 01 — 00:00–00:08: VIDEO PROMPT: Emma and Lily walking home on a quiet suburban street at sunset, Lily suddenly stops and points across the street at a mysterious man standing beside a parked black car, Emma turns toward him in confusion, cinematic realism, slow push-in camera, emotional tension, realistic body language, natural sunset lighting, shallow depth of field; VOICE PROMPT: Young girl whispers with sudden fear and certainty, “Mom… that’s my father.”

SCENE 02 — 00:08–00:16: VIDEO PROMPT: Extreme close-up of Emma's face as her expression changes from confusion to shock, her breathing stops, her eyes locked on the distant man who slowly turns away, handheld cinematic camera with subtle trembling movement, dramatic rack focus; VOICE PROMPT: Female voice, restrained shock, “Lily… your father died seven years ago.”

SCENE 03 — 00:16–00:24: VIDEO PROMPT: The mysterious man walks quickly toward his black car without looking back, Emma takes one step forward while Lily watches him intensely, camera tracks backward in front of Emma, tense cinematic atmosphere; VOICE PROMPT: Little girl speaks urgently, “No, Mom. I know his face.”

SCENE 04 — 00:24–00:32: VIDEO PROMPT: Emma rushes toward the street, but the black car accelerates away around the corner, she stops helplessly, camera follows the car then whip-pans back to Emma and Lily, realistic urban ambience; VOICE PROMPT: Female narration, tense and emotional, “For seven years, Emma had believed Daniel was dead.”

SCENE 05 — 00:32–00:40: VIDEO PROMPT: Nighttime inside Emma's dimly lit bedroom, she opens an old wooden box containing Daniel's wedding ring, photographs, and an obituary, warm bedside lamp illuminating her trembling hands, slow overhead camera movement; VOICE PROMPT: Female narration, quiet and suspicious, “But that night, one impossible question kept her awake.”

SCENE 06 — 00:40–00:48: VIDEO PROMPT: A mysterious envelope slides beneath Emma's front door, she notices it while standing in the hallway, slowly picks it up, no sender name visible, camera moves from the envelope to her nervous face; VOICE PROMPT: Female voice, low and uneasy, “Then someone left her a message.”

SCENE 07 — 00:48–00:56: VIDEO PROMPT: Close-up of Emma opening the envelope and pulling out an old photograph showing Emma and Daniel together years earlier, handwritten message visible but not readable, her hands begin shaking, macro cinematic focus; VOICE PROMPT: Female narration, suspenseful whisper, “You were never supposed to find out.”

SCENE 08 — 00:56–01:04: VIDEO PROMPT: Emma studies the photograph under a single lamp, notices a small unfamiliar man standing blurred in the distant background, camera slowly pushes toward the background figure, Emma's eyes widen; VOICE PROMPT: Female voice, confused, “Who is that?”

SCENE 09 — 01:04–01:12: VIDEO PROMPT: Emma searches through an old family drawer and finds another photograph of Daniel standing beside an identical-looking man, she compares both faces under the light, slow lateral camera movement; VOICE PROMPT: Female narration, increasingly alarmed, “The face beside Daniel was exactly the same.”

SCENE 10 — 01:12–01:20: VIDEO PROMPT: Morning, Emma drives through the city following a handwritten address from the envelope, her eyes repeatedly checking the rearview mirror, cinematic car interior, camera mounted near passenger seat with subtle vibration; VOICE PROMPT: Female narration, determined but frightened, “The address led her to a building she had never seen before.”

SCENE 11 — 01:20–01:28: VIDEO PROMPT: Emma enters an abandoned-looking apartment building, narrow hallway with flickering lights, she slowly walks forward while hearing a man's voice behind a closed door, camera tracks beside her; VOICE PROMPT: Male voice from behind the door, calm and mysterious, “She still believes Daniel is dead.”

SCENE 12 — 01:28–01:36: VIDEO PROMPT: Emma freezes outside the door, her hand hovering above the handle, then slowly opens it to reveal Michael standing in a dim apartment, identical to Daniel but older and more guarded, slow dramatic reveal camera; VOICE PROMPT: Female voice, trembling disbelief, “Daniel?”

SCENE 13 — 01:36–01:44: VIDEO PROMPT: Michael looks at Emma with sadness but does not approach her, Emma stares at him searching his face, tense silence, alternating close-ups, cinematic shallow depth of field; VOICE PROMPT: Male voice, controlled and emotional, “No. My name is Michael.”

SCENE 14 — 01:44–01:52: VIDEO PROMPT: Emma steps backward in disbelief while Michael places an old photograph on the table showing himself and Daniel as children, camera slowly circles both characters, dramatic warm practical lighting; VOICE PROMPT: Male voice, quiet revelation, “Daniel was my twin brother.”

SCENE 15 — 01:52–02:00: VIDEO PROMPT: Rapid cinematic flashback montage of Daniel secretly leaving home, changing clothes, meeting an unknown man, and disappearing into the night seven years earlier, desaturated memory style, fast controlled camera movements; VOICE PROMPT: Male narration, serious and restrained, “But Daniel didn't die that night. He disappeared.”

SCENE 16 — 02:00–02:08: VIDEO PROMPT: Emma confronts Michael, tears forming but anger controlling her face, Michael avoids eye contact and looks toward the window, tense two-shot with slow dolly movement; VOICE PROMPT: Female voice, hurt and angry, “Why would he let me believe he was dead?”

SCENE 17 — 02:08–02:16: VIDEO PROMPT: Michael slowly reveals an old file containing financial documents and photographs, Emma looks through them and realizes Daniel had been involved in serious fraud, camera pushes toward her shocked expression; VOICE PROMPT: Male voice, heavy and cautious, “Because you were about to expose everything he had done.”

SCENE 18 — 02:16–02:24: VIDEO PROMPT: Close-up of Emma discovering a recent photograph of Lily inside the file, taken from a distance outside her school, her expression instantly changes from anger to fear, camera rapidly pushes in; VOICE PROMPT: Female voice, frightened whisper, “He has been watching Lily?”

SCENE 19 — 02:24–02:32: VIDEO PROMPT: Michael looks directly into Emma's eyes, then reveals a small phone containing a recent message from Daniel, Emma stares at the screen in disbelief, slow dramatic camera orbit; VOICE PROMPT: Male voice, grave and quiet, “He never stopped watching you.”

SCENE 20 — 02:32–02:40: VIDEO PROMPT: Emma grabs the phone and reads the latest message, her hands shaking, camera moves over her shoulder toward the glowing screen without showing readable text, suspenseful lighting; VOICE PROMPT: Female voice, barely audible, “Where is Daniel?”

SCENE 21 — 02:40–02:48: VIDEO PROMPT: Michael looks toward the apartment doorway as a faint sound comes from the hallway, Emma turns slowly, both characters suddenly alert, camera pulls backward into the dark corridor; VOICE PROMPT: Michael whispers with fear, “He's closer than you think.”

SCENE 22 — 02:48–02:56: VIDEO PROMPT: Emma returns home at night and finds Lily standing silently near the living-room window, Lily looks toward the front door as footsteps approach outside, camera slowly moves behind them toward the doorway; VOICE PROMPT: Lily whispers with certainty, “Mom… he's here.”

SCENE 23 — 02:56–03:00: VIDEO PROMPT: The front door slowly opens, only a mysterious man's hand appears holding an old photograph of Emma, camera rapidly pushes toward the photograph before cutting to black, intense cinematic sound design, unresolved mystery; VOICE PROMPT: Deep male whisper, chilling and emotional, “You finally found me.”`;
