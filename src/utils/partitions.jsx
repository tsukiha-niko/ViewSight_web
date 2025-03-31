// utils/partitions.jsx
export const all_partitions = [
    {
      name: "动画", code: "douga", tid: 1, url: "/v/douga",
      subcategories: [
        { name: "MAD·AMV", code: "mad", tid: 24, url: "/v/douga/mad" },
        { name: "MMD·3D", code: "mmd", tid: 25, url: "/v/douga/mmd" },
        { name: "短片·手书", code: "handdrawn", tid: 47, url: "/v/douga/handdrawn" },
        { name: "配音", code: "voice", tid: 257, url: "/v/douga/voice" },
        { name: "手办·模玩", code: "garage_kit", tid: 210, url: "/v/douga/garage_kit" },
        { name: "特摄", code: "tokusatsu", tid: 86, url: "/v/douga/tokusatsu" },
        { name: "动漫杂谈", code: "acgntalks", tid: 253, url: "/v/douga/acgntalks" },
        { name: "综合", code: "other", tid: 27, url: "/v/douga/other" }
      ]
    },
    {
      name: "番剧", code: "anime", tid: 13, url: "/anime",
      subcategories: [
        { name: "资讯", code: "information", tid: 51, url: "/v/anime/information" },
        { name: "官方延伸", code: "offical", tid: 152, url: "/v/anime/offical" },
        { name: "完结动画", code: "finish", tid: 32, url: "/v/anime/finish" },
        { name: "连载动画", code: "serial", tid: 33, url: "/v/anime/serial" }
      ]
    },
    {
      name: "国创", code: "guochuang", tid: 167, url: "/guochuang",
      subcategories: [
        { name: "国产动画", code: "chinese", tid: 153, url: "/v/guochuang/chinese" },
        { name: "国产原创相关", code: "original", tid: 168, url: "/v/guochuang/original" },
        { name: "布袋戏", code: "puppetry", tid: 169, url: "/v/guochuang/puppetry" },
        { name: "资讯", code: "information", tid: 170, url: "/v/guochuang/information" },
        { name: "动态漫·广播剧", code: "motioncomic", tid: 195, url: "/v/guochuang/motioncomic" }
      ]
    },
    {
      name: "音乐", code: "music", tid: 3, url: "/v/music",
      subcategories: [
        { name: "原创音乐", code: "original", tid: 28, url: "/v/music/original" },
        { name: "翻唱", code: "cover", tid: 31, url: "/v/music/cover" },
        { name: "VOCALOID·UTAU", code: "vocaloid", tid: 30, url: "/v/music/vocaloid" },
        { name: "演奏", code: "perform", tid: 59, url: "/v/music/perform" },
        { name: "MV", code: "mv", tid: 193, url: "/v/music/mv" },
        { name: "音乐现场", code: "live", tid: 29, url: "/v/music/live" },
        { name: "音乐综合", code: "other", tid: 130, url: "/v/music/other" },
        { name: "乐评盘点", code: "commentary", tid: 243, url: "/v/music/commentary" },
        { name: "音乐教学", code: "tutorial", tid: 244, url: "/v/music/tutorial" },
        { name: "电音(已下线)", code: "electronic", tid: 194, url: "/v/music/electronic" }
      ]
    },
    {
      name: "舞蹈", code: "dance", tid: 129, url: "/v/dance",
      subcategories: [
        { name: "宅舞", code: "otaku", tid: 20, url: "/v/dance/otaku" },
        { name: "舞蹈综合", code: "three_d", tid: 154, url: "/v/dance/three_d" },
        { name: "舞蹈教程", code: "demo", tid: 156, url: "/v/dance/demo" },
        { name: "街舞", code: "hiphop", tid: 198, url: "/v/dance/hiphop" },
        { name: "明星舞蹈", code: "star", tid: 199, url: "/v/dance/star" },
        { name: "国风舞蹈", code: "china", tid: 200, url: "/v/dance/china" },
        { name: "手势·网红舞", code: "gestures", tid: 255, url: "/v/dance/gestures" }
      ]
    },
    {
      name: "游戏", code: "game", tid: 4, url: "/v/game",
      subcategories: [
        { name: "单机游戏", code: "stand_alone", tid: 17, url: "/v/game/stand_alone" },
        { name: "电子竞技", code: "esports", tid: 171, url: "/v/game/esports" },
        { name: "手机游戏", code: "mobile", tid: 172, url: "/v/game/mobile" },
        { name: "网络游戏", code: "online", tid: 65, url: "/v/game/online" },
        { name: "桌游棋牌", code: "board", tid: 173, url: "/v/game/board" },
        { name: "GMV", code: "gmv", tid: 121, url: "/v/game/gmv" },
        { name: "音游", code: "music", tid: 136, url: "/v/game/music" },
        { name: "Mugen", code: "mugen", tid: 19, url: "/v/game/mugen" }
      ]
    },
    {
      name: "知识", code: "knowledge", tid: 36, url: "/v/knowledge",
      subcategories: [
        { name: "科学科普", code: "science", tid: 201, url: "/v/knowledge/science" },
        { name: "社科·法律·心理", code: "social_science", tid: 124, url: "/v/knowledge/social_science" },
        { name: "人文历史", code: "humanity_history", tid: 228, url: "/v/knowledge/humanity_history" },
        { name: "财经商业", code: "business", tid: 207, url: "/v/knowledge/finance" },
        { name: "校园学习", code: "campus", tid: 208, url: "/v/knowledge/campus" },
        { name: "职业职场", code: "career", tid: 209, url: "/v/knowledge/career" },
        { name: "设计·创意", code: "design", tid: 229, url: "/v/knowledge/design" },
        { name: "野生技术协会", code: "skill", tid: 122, url: "/v/knowledge/skill" },
        { name: "演讲·公开课(已下线)", code: "speech_course", tid: 39, url: "/v/technology/speech_course" },
        { name: "星海(已下线)", code: "military", tid: 96, url: "/v/technology/military" },
        { name: "机械(已下线)", code: "mechanical", tid: 98, url: "/v/technology/mechanical" }
      ]
    },
    {
      name: "科技", code: "tech", tid: 188, url: "/v/tech",
      subcategories: [
        { name: "数码", code: "digital", tid: 95, url: "/v/tech/digital" },
        { name: "软件应用", code: "application", tid: 230, url: "/v/tech/application" },
        { name: "计算机技术", code: "computer_tech", tid: 231, url: "/v/tech/computer_tech" },
        { name: "科工机械", code: "industry", tid: 232, url: "/v/tech/industry" },
        { name: "极客DIY", code: "diy", tid: 233, url: "/v/tech/diy" },
        { name: "电脑装机(已下线)", code: "pc", tid: 189, url: "/v/digital/pc" },
        { name: "摄影摄像(已下线)", code: "photography", tid: 190, url: "/v/digital/photography" },
        { name: "影音智能(已下线)", code: "intelligence_av", tid: 191, url: "/v/digital/intelligence_av" }
      ]
    },
    {
      name: "运动", code: "sports", tid: 234, url: "/v/sports",
      subcategories: [
        { name: "篮球", code: "basketball", tid: 235, url: "/v/sports/basketball" },
        { name: "足球", code: "football", tid: 249, url: "/v/sports/football" },
        { name: "健身", code: "aerobics", tid: 164, url: "/v/sports/aerobics" },
        { name: "竞技体育", code: "athletic", tid: 236, url: "/v/sports/culture" },
        { name: "运动文化", code: "culture", tid: 237, url: "/v/sports/culture" },
        { name: "运动综合", code: "comprehensive", tid: 238, url: "/v/sports/comprehensive" }
      ]
    },
    {
      name: "汽车", code: "car", tid: 223, url: "/v/car",
      subcategories: [
        { name: "汽车知识科普", code: "knowledge", tid: 258, url: "/v/car/knowledge" },
        { name: "赛车", code: "racing", tid: 245, url: "/v/car/racing" },
        { name: "改装玩车", code: "modifiedvehicle", tid: 246, url: "/v/car/modifiedvehicle" },
        { name: "新能源车", code: "newenergyvehicle", tid: 247, url: "/v/car/newenergyvehicle" },
        { name: "房车", code: "touringcar", tid: 248, url: "/v/car/touringcar" },
        { name: "摩托车", code: "motorcycle", tid: 240, url: "/v/car/motorcycle" },
        { name: "购车攻略", code: "strategy", tid: 227, url: "/v/car/strategy" },
        { name: "汽车生活", code: "life", tid: 176, url: "/v/car/life" },
        { name: "汽车文化(已下线)", code: "culture", tid: 224, url: "/v/car/culture" },
        { name: "汽车极客(已下线)", code: "geek", tid: 225, url: "/v/car/geek" },
        { name: "智能出行(已下线)", code: "smart", tid: 226, url: "/v/car/smart" }
      ]
    },
    {
      name: "生活", code: "life", tid: 160, url: "/v/life",
      subcategories: [
        { name: "搞笑", code: "funny", tid: 138, url: "/v/life/funny" },
        { name: "出行", code: "travel", tid: 250, url: "/v/life/travel" },
        { name: "三农", code: "rurallife", tid: 251, url: "/v/life/rurallife" },
        { name: "家居房产", code: "home", tid: 239, url: "/v/life/home" },
        { name: "手工", code: "handmake", tid: 161, url: "/v/life/handmake" },
        { name: "绘画", code: "painting", tid: 162, url: "/v/life/painting" },
        { name: "日常", code: "daily", tid: 21, url: "/v/life/daily" },
        { name: "亲子", code: "parenting", tid: 254, url: "/v/life/parenting" },
        { name: "美食圈(重定向)", code: "food", tid: 76, url: "/v/life/food" },
        { name: "动物圈(重定向)", code: "animal", tid: 75, url: "/v/life/animal" },
        { name: "运动(重定向)", code: "sports", tid: 163, url: "/v/life/sports" },
        { name: "汽车(重定向)", code: "automobile", tid: 176, url: "/v/life/automobile" },
        { name: "其他(已下线)", code: "other", tid: 174, url: "/v/life/other" }
      ]
    },
    {
      name: "美食", code: "food", tid: 211, url: "/v/food",
      subcategories: [
        { name: "美食制作", code: "make", tid: 76, url: "/v/food/make" },
        { name: "美食侦探", code: "detective", tid: 212, url: "/v/food/detective" },
        { name: "美食测评", code: "measurement", tid: 213, url: "/v/food/measurement" },
        { name: "田园美食", code: "rural", tid: 214, url: "/v/food/rural" },
        { name: "美食记录", code: "record", tid: 215, url: "/v/food/record" }
      ]
    },
    {
      name: "动物圈", code: "animal", tid: 217, url: "/v/animal",
      subcategories: [
        { name: "喵星人", code: "cat", tid: 218, url: "/v/animal/cat" },
        { name: "汪星人", code: "dog", tid: 219, url: "/v/animal/dog" },
        { name: "动物二创", code: "second_edition", tid: 220, url: "/v/animal/second_edition" },
        { name: "野生动物", code: "wild_animal", tid: 221, url: "/v/animal/wild_animal" },
        { name: "小宠异宠", code: "reptiles", tid: 222, url: "/v/animal/reptiles" },
        { name: "动物综合", code: "animal_composite", tid: 75, url: "/v/animal/animal_composite" }
      ]
    },
    {
      name: "鬼畜", code: "kichiku", tid: 119, url: "/v/kichiku",
      subcategories: [
        { name: "鬼畜调教", code: "guide", tid: 22, url: "/v/kichiku/guide" },
        { name: "音MAD", code: "mad", tid: 26, url: "/v/kichiku/mad" },
        { name: "人力VOCALOID", code: "manual_vocaloid", tid: 126, url: "/v/kichiku/manual_vocaloid" },
        { name: "鬼畜剧场", code: "theatre", tid: 216, url: "/v/kichiku/theatre" },
        { name: "教程演示", code: "course", tid: 127, url: "/v/kichiku/course" }
      ]
    },
    {
      name: "时尚", code: "fashion", tid: 155, url: "/v/fashion",
      subcategories: [
        { name: "美妆护肤", code: "makeup", tid: 157, url: "/v/fashion/makeup" },
        { name: "仿妆cos", code: "cos", tid: 252, url: "/v/fashion/cos" },
        { name: "穿搭", code: "clothing", tid: 158, url: "/v/fashion/clothing" },
        { name: "时尚潮流", code: "catwalk", tid: 159, url: "/v/fashion/catwalk" },
        { name: "健身(重定向)", code: "aerobics", tid: 164, url: "/v/fashion/aerobics" },
        { name: "风尚标(已下线)", code: "trends", tid: 192, url: "/v/fashion/trends" }
      ]
    },
    {
      name: "资讯", code: "information", tid: 202, url: "/v/information",
      subcategories: [
        { name: "热点", code: "hotspot", tid: 203, url: "/v/information/hotspot" },
        { name: "环球", code: "global", tid: 204, url: "/v/information/global" },
        { name: "社会", code: "social", tid: 205, url: "/v/information/social" },
        { name: "综合", code: "multiple", tid: 206, url: "/v/information/multiple" }
      ]
    },
    {
      name: "广告", code: "ad", tid: 165, url: "/v/ad",
      subcategories: [
        { name: "广告(已下线)", code: "ad", tid: 166, url: "/v/ad/ad" }
      ]
    },
    {
      name: "娱乐", code: "ent", tid: 5, url: "/v/ent",
      subcategories: [
        { name: "综艺", code: "variety", tid: 71, url: "/v/ent/variety" },
        { name: "娱乐杂谈", code: "talker", tid: 241, url: "/v/ent/talker" },
        { name: "粉丝创作", code: "fans", tid: 242, url: "/v/ent/fans" },
        { name: "明星综合", code: "celebrity", tid: 137, url: "/v/ent/celebrity" },
        { name: "Korea相关(已下线)", code: "korea", tid: 131, url: "/v/ent/korea" }
      ]
    },
    {
      name: "影视", code: "cinephile", tid: 181, url: "/v/cinephile",
      subcategories: [
        { name: "影视杂谈", code: "cinecism", tid: 182, url: "/v/cinephile/cinecism" },
        { name: "影视剪辑", code: "montage", tid: 183, url: "/v/cinephile/montage" },
        { name: "小剧场", code: "shortfilm", tid: 85, url: "/v/cinephile/shortfilm" },
        { name: "预告·资讯", code: "trailer_info", tid: 184, url: "/v/cinephile/trailer_info" },
        { name: "短片", code: "shortfilm", tid: 256, url: "/v/cinephile/shortfilm" }
      ]
    },
    {
      name: "纪录片", code: "documentary", tid: 177, url: "/documentary",
      subcategories: [
        { name: "人文·历史", code: "history", tid: 37, url: "/v/documentary/history" },
        { name: "科学·探索·自然", code: "science", tid: 178, url: "/v/documentary/science" },
        { name: "军事", code: "military", tid: 179, url: "/v/documentary/military" },
        { name: "社会·美食·旅行", code: "travel", tid: 180, url: "/v/documentary/travel" }
      ]
    },
    {
      name: "电影", code: "movie", tid: 23, url: "/movie",
      subcategories: [
        { name: "华语电影", code: "chinese", tid: 147, url: "/v/movie/chinese" },
        { name: "欧美电影", code: "west", tid: 145, url: "/v/movie/west" },
        { name: "日本电影", code: "japan", tid: 146, url: "/v/movie/japan" },
        { name: "其他国家", code: "movie", tid: 83, url: "/v/movie/movie" }
      ]
    },
    {
      name: "电视剧", code: "tv", tid: 11, url: "/tv",
      subcategories: [
        { name: "国产剧", code: "mainland", tid: 185, url: "/v/tv/mainland" },
        { name: "海外剧", code: "overseas", tid: 187, url: "/v/tv/overseas" }
      ]
    }
  ];