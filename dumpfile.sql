--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: park; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.park (
    "parkId" integer NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(1000),
    location character varying(300) NOT NULL
);


ALTER TABLE public.park OWNER TO postgres;

--
-- Name: park_parkId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."park_parkId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."park_parkId_seq" OWNER TO postgres;

--
-- Name: park_parkId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."park_parkId_seq" OWNED BY public.park."parkId";


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    clerk_user_id text NOT NULL,
    username text,
    email text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: park parkId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.park ALTER COLUMN "parkId" SET DEFAULT nextval('public."park_parkId_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3df42591-70f9-4267-83f9-abc3060dc678	43da39191add144ff9a80b141dd5f83e0266261917293a76b8335c92d2a5b791	2024-09-16 14:38:57.063981-06	20240916203857_init	\N	\N	2024-09-16 14:38:57.052766-06	1
1e0b94bd-2c88-450f-8fa7-c66f35a859f5	7e4ab7c0f9c78e4786dcb69db130530fb8af501781963ffdf4290b656f2e40dc	2024-09-16 16:23:41.32726-06	20240916222341_add_park_table	\N	\N	2024-09-16 16:23:41.176138-06	1
\.


--
-- Data for Name: park; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.park ("parkId", name, description, location) FROM stdin;
1	Banff National Park	Founded in 1885, Banff is Canada's first national park and part of the first national park system in the world. With its soaring peaks, azure lakes, and abundant wildlife, this Rocky Mountain park attracts millions of visitors every year.	Improvement District No. 9, AB T0L
2	Elk Island National Park	Experience first-hand the story of the bison and how it was saved from near extinction at Elk Island National Park, where an active conservation program replenishes herds around the world.	54401 Range Rd 203, Fort Saskatchewan, AB T8L 0V3
3	Jasper National Park	Abundant in natural beauty, wildlife, lakes, waterfalls, and mountains, Jasper is a wild and wondrous place to visit year-round.	Jasper, AB T0E 1E0
4	Waterton Lakes National Park	The prairies of Alberta meet the peaks of the Rocky Mountains in Waterton Lakes National Park.	Waterton Park, AB T0K 2M0
5	Glacier National Park	Glacier is known for steep alpine hikes, lush cedar forests and unparalleled backcountry skiing. At the heart of the park, history comes alive at Rogers Pass, the key to completion of Canada's transcontinental railway.	Columbia-Shuswap, BC V0X 1R0
6	Gulf Islands National Park Reserve	Scattered throughout the Salish Sea, the Gulf Islands teem with wildlife, a haven for rare species and threatened ecosystems and a playground for hikers, campers, cyclists, boaters and kayakers.	195-203 Narvaez Bay Rd, Saturna, BC V0N 2Y0
7	Gwaii Haanas National Park Reserve	Amid lush rainforest islands and seas rich with wildlife, Gwaii Haanas harbours rare sites of carved poles and longhouses, making this park culturally important to the Haida people who co-manage cooperatively manage the region with Parks Canada.	Daajing Giids, BC V0T 1S0
8	Kootenay National Park	With diverse terrain embracing everything from arid grasslands to glaciers, Kootenay National Park offers the full Rocky Mountain experience along the historic Banff-Windermere Highway. Take a scenic drive or stay and explore the park’s treasures.	7556 Main St E, Radium Hot Springs, V0A 1E0
9	Mount Revelstoke National Park	Stroll through brilliant wildflower meadows, or lie back in awe atop a mountain peak. From lush green valley to mountain summit, all is within a leisurely day’s drive at Mount Revelstoke National Park.	Meadows in the Sky Pkwy, Revelstoke, BC V0E 2S0
10	Pacific Rim National Park Reserve	Catch a wave, or spread a blanket and watch the sun dip below the horizon. From rainforests on land to marine kelp forests at sea, Pacific Rim National Park Reserve embodies the rich natural and cultural heritage of Canada’s west coast.	Pacific Rim National Park Reserve, British Columbia
11	Yoho National Park	In the shadow of the Great Divide, Yoho’s towering rockwalls, spectacular waterfalls and soaring peaks reveal the secrets of ancient life, the power of ice and water and the stories of plants and animals that continue to evolve today.	Field, BC V0A 1G0
12	Riding Mountain National Park	Explore 3000 km2 of thrilling outdoor possibilities in Riding Mountain National Park where the boreal forest, aspen parkland and fescue prairie meet.	135 Wasagaming Dr, Onanole, MB R0J 1N0
13	Wapusk National Park	A vast subarctic wilderness of tundra and boreal forest, Wapusk protects one of the world’s largest known polar bear maternity denning areas, as well as more than 200 bird species, caribou, wolverine, arctic hare and foxes.	Manitoba R0B 0E0
14	Fundy National Park	The world’s highest tides await visitors at Fundy National Park. Kayak on the Bay of Fundy, explore the seafloor when the tide recedes, hike or bike through native Acadian forests and more at one of Canada’s best-known national parks.	Alma, NB
15	Kouchibouguac National Park	Golden sand dunes, estuaries brimming with life, warm ocean beaches, Mi’kmaq and Acadian culture, the starry spectacle of a Dark Sky Preserve and snowbound winter activities weave together the compelling tapestry of Kouchibouguac National Park.	National 186, NB-117, Kouchibouguac, NB E4X 1V2
16	Akami-Uapishk KakKasuak-Mealy Mountains National Park	Located in Labrador, the glacially-rounded, bare rock summits of the Mealy Mountains reach up to 1180 meters to overlook Lake Melville. The pristine landscape of mountain tundra, marine coasts, boreal forests, islands and rivers are home to numerous boreal species.	National Park Reserve, Mealy Mountains
17	Gros Morne National Park	Cruise sheer-walled fjords and hike diverse landscapes from windswept shorelines to sub-Arctic summits. Explore rare geological oddities that earned Gros Morne UNESCO World Heritage status, and relax amid the culture of Newfoundland’s coastal communities.	Rocky Harbour NL A0K 4N0
18	Terra Nova National Park	A dramatic Atlantic shoreline, fringed in long headlands and fjords with views of whales and icebergs, gives way to marshland, tranquil ponds and wildlife-filled boreal forest – Terra Nova is accessible, wild Newfoundland for outdoor enthusiasts and nature-lovers of every age.	Trans-Canada Hwy Glovertown, Traytown, NL A0G 4K0
19	Torngat Mountains National Park	Amid jagged peaks and vast glacial valleys, polar bears and caribou roam the Torngat Mountains, for centuries the homeland of Inuit who today now welcome visitors to experience a dramatic landscape where nature and culture meet.	Torngat Mountains, Nain, NL A0P 1L0
20	Aulavik National Park	Located in Canada’s Northwest Territories, Aulavik is among the country’s most remote national parks. But it rewards adventurers with untouched tundra, pristine rivers, archaeological sites and ample wildlife, from muskoxen to seals and other marine mammals.	Aulavik National Park, Sachs Harbour, NT X0E 0Z0
21	Nahanni National Park Reserve	Remote granite pinnacles lure top alpinists, wilderness river tripping opportunities attract paddlers, interpreters share cultural and natural history with river trippers, campers and day flight visitors.	Fort Smith, Unorganized, NT
22	Nááts'hch'oh National Park Reserve	In the headwaters of Tehjeh Deé (South Nahanni River) Nááts'hch'oh National Park Reserve is a place where culture and nature are intertwined. Nááts'hch'oh offers whitewater paddling and off-the-grid hiking in the Northwest Territories for experienced adventurers.	Fort Smith Region, Tulita, NT
23	Thaidene Nëné National Park Reserve	Located at the eastern end of Great Slave Lake in the Northwest Territories, Thaidene Nëné National Park Reserve is part of a larger group of protected areas around the East Arm and Artillery Lake regions. Thaidene Nëné means ‘Land of the Ancestors’ in the Dënes??iné—or Chipewyan—language.	Thaidene Nene National Park Reserve Lutselk'e, NT
24	Tuktut Nogait National Park	Arctic rivers, waterfalls, canyons and tundra combine to provide habitat for caribou, muskoxen, wolves and other arctic species.	Inuvik, Unorganized, NT X0E 1N
25	Wood Buffalo National Park	Wood Buffalo National Park is our country's largest national park and one of the largest in the world. It protects an outstanding and representative example of Canada's Northern Boreal Plains.	59°23?N 112°59?W? / ?59.383°N 112.983°W
26	Cape Breton Highlands National Park	A third of the world-famous Cabot Trail winds through Cape Breton Highlands National Park, renowned for stunning ocean vistas, deep-cut canyons, 26 diverse hiking trails, spectacular campsites and glorious sandy beaches.	Ingonish Beach, NS
27	ejimkujik National Park and National Historic Site	Explore 4,000 years of Mi’kmaw heritage. Camp lakeside amidst Acadian forest. Spot harbour seals from a singing beach. Be enthralled by a Dark Sky Preserve. There are many sides to Kejimkujik and you can discover them all.	3005 Kejimkujik Main Parkway, Maitland Bridge, NS B0T 1B0
28	Sable Island National Park Reserve	A home to wild horses, submerged shipwrecks, rare birds and basking grey seals, Sable Island National Park Reserve defines the word “remote.”	Sable Island, Halifax, NS B0J 1M0
29	Auyuittuq National Park	Home to spectacular natural landmarks like the Akshayuk Pass, Thor Peak and the Penny Ice Cap, Auyuittuq is the “land that never melts” in Inuktitut.	Qikiqtaaluk Region, NU X0A 0R0
30	Qausuittuq National Park	A home for the endangered Peary caribou and a traditional Inuit hunting and fishing area on Bathurst Island in Nunavut’s High Arctic.	Qikiqtaaluk Region, NU
31	Quttinirpaaq National Park	Inuktitut for “land at the top of the world”, Quttinirpaaq is Canada’s northernmost national park, a vast arctic wilderness on Ellesmere Island.	Ellesmere Island, NU
32	Sirmilik National Park	Narwhals, belugas, polar bears and thousands of seabirds thrive in the Arctic landscape of Bylot Island and Baffin Island’s Borden Peninsula.	Bylot Island, NU
33	Ukkusiksalik National Park	An area rich in arctic wildlife and Inuit history where hundreds of archaeological sites dot the landscape surrounding Wager Bay.	Kivalliq Region, NU X0C 0H0
34	Bruce Peninsula National Park	Bruce Peninsula National Park beckons hikers to travel woodland trails, swimmers to refresh in clear waters, explorers to discover the rugged limestone coast and campers to revel at a stunning night sky.	Tobermory, ON N0H 2R0
35	Georgian Bay Islands National Park	Swim in Lake Huron’s clear waters. Cycle wooded island trails. Hike paths that meander between ecosystems. Unwind at a cosy cabin. Welcome to an inspiring and beautiful place. Welcome to Georgian Bay Islands National Park.	2611 Honey Harbour Road, Honey Harbour, ON P0E 1E0
36	Point Pelee National Park	Explore the Southernmost point of mainland Canada at Point Pelee National Park. Enjoy walking and cycling trails, paddling, birding, swimming and more.	1118 Point Pelee Dr, Leamington, ON N8H 3V4
37	Pukaskwa National Park	Waves roll across immense Lake Superior and crash against a remote granite shore. Tracts of windswept spruce and pine reach beyond the horizon from towering cliffs and along secluded sandy beaches. Black bears feast on blueberry bushes; haunting loon song scores sunsets; moose stilt-walk across wetlands. And the culture of the Anishinaabe First Nations connects Pukaskwa National Park's wilderness to the powerful richness of an ancient human story.	ON-627, Heron Bay, ON P0T 1R0
38	Rouge National Urban Park	Explore one of the largest urban parks in North America, conveniently located in the Greater Toronto Area. Discover the natural wonders of Canada through the park's rich assembly of forests, creeks, farms and trails as well as marshland, a beach on Lake Ontario and human history spanning 10,000 years.	25 Zoo Rd, Toronto, ON M1B 5W8
39	Thousand Islands National Park	Granite islands speckle the St. Lawrence River in a transition zone between Canadian Shield and Adirondack Mountains. Explore by boating, paddling, or hiking. Awesome Thousand Islands National Park awaits, a few hours from Toronto or Montreal.	1121 Thousand Islands Pkwy, Mallorytown Landing, ON K0E 1R0
40	Prince Edward Island National Park	Cliff and dune-lined beaches, woodlands and wetlands rich with wildlife, and all levels of outdoor activities make Prince Edward Island National Park a diverse and accessible natural destination for a seaside escape, restful or active.	41 Dalvay Crescent, Dalvay by the Sea, PE C0A 1P0
41	Forillon National Park	Forillon is a place where you can paddle with seals, watch passing whales and swim off a magnificent sandy beach all on the same day. You may even see a beaver on a walk through the forest.	2286 Bd de Grande-Grève, Gaspé, QC G4X 6L7
42	La Mauricie National Park	With its 536 km2 area, La Mauricie National Park is the ideal place for an outdoor escape. Hills, forests and streams are accessible any season of the year.	Chem. de Saint-Jean-des-Piles, Shawinigan, QC G0X 2V0
43	Mingan Archipelago National Park Reserve	The first word that springs to mind at the mention of the Mingan Archipelago is “remote”. Far from the hustle and bustle of everyday life, Mother Nature enchants with limestone sculptures, prolific marine and bird life, and the seductive sound of the sea.	1010 Promenade Des Anciens, Havre-Saint-Pierre, QC G0G 1P0
44	Grasslands National Park	At Grasslands National Park, expanses of dinosaur fossils harken back to a time before history. Tipi rings are testament to First Nations communities, and ruins of prairie homesteads tell of settlers intent on taming the prairie.	SK-4, Val Marie, SK
45	Prince Albert National Park	Prince Albert National Park offers accessible wilderness and extensive outdoor recreation in central Saskatchewan. Hike boreal forests, canoe pristine lakes and see free-range bison, with the town of Waskesiu as a convenient base.	969 Lakeview Dr, Waskesiu Lake, SK S0J 2Y0
46	Ivvavik National Park	Rafters from around the world meet up in Ivvavik National Park. The Firth River slices through canyons and mountain valleys to the Arctic Ocean. A fly-in base camp offers hikers access to an Arctic landscape of tors, peaks and rolling hills untouched by the last Ice Age.	Ivvavik National Park, Unorganized, YT Y0B 1G0
47	Kluane National Park and Reserve	With vast icefields and 17 of Canada’s 20 highest peaks, Kluane offers outstanding alpine scenery, rich First Nations culture and history, and a mix of extreme adventure and accessible outdoor recreation.	Haines Junction, YT Y0B 1L0
48	Vuntut National Park	Explore untouched northern landscapes and learn the story of the Vuntut Gwitchin people and their relationship to the land and animals of the northern Yukon.	YT Y0B 1N0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, clerk_user_id, username, email, created_at, "updatedAt", password) FROM stdin;
\.


--
-- Name: park_parkId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."park_parkId_seq"', 48, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: park park_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.park
    ADD CONSTRAINT park_pkey PRIMARY KEY ("parkId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_clerk_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_clerk_user_id_key ON public.users USING btree (clerk_user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

