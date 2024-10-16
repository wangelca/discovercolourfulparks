--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

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
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    "bookingId" integer NOT NULL,
    "spotId" integer NOT NULL,
    "eventId" integer NOT NULL,
    "bookingDate" timestamp(3) without time zone NOT NULL,
    "bookingStartTime" timestamp(3) without time zone NOT NULL,
    "bookingStatus" text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- Name: booking_bookingId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."booking_bookingId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."booking_bookingId_seq" OWNER TO postgres;

--
-- Name: booking_bookingId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."booking_bookingId_seq" OWNED BY public.booking."bookingId";


--
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event (
    "eventId" integer NOT NULL,
    "parkId" integer NOT NULL,
    "eventName" text NOT NULL,
    "eventLocation" text NOT NULL,
    fee double precision NOT NULL,
    description text NOT NULL,
    discount double precision NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "eventImageUrl" text[],
    parameters text,
    requiredbooking boolean DEFAULT false NOT NULL
);


ALTER TABLE public.event OWNER TO postgres;

--
-- Name: event_eventId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."event_eventId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."event_eventId_seq" OWNER TO postgres;

--
-- Name: event_eventId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."event_eventId_seq" OWNED BY public.event."eventId";


--
-- Name: park; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.park (
    "parkId" integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    parameters text,
    "parkImageUrl" text[],
    province text
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
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    "paymentId" integer NOT NULL,
    "bookingId" integer NOT NULL,
    "paymentStatus" text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_paymentId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."payment_paymentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."payment_paymentId_seq" OWNER TO postgres;

--
-- Name: payment_paymentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."payment_paymentId_seq" OWNED BY public.payment."paymentId";


--
-- Name: spot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spot (
    "spotId" integer NOT NULL,
    "parkId" integer NOT NULL,
    "spotName" text NOT NULL,
    "spotDescription" text NOT NULL,
    "spotAdmission" double precision NOT NULL,
    "spotDiscount" double precision NOT NULL,
    "spotLocation" text NOT NULL,
    "spotImageUrl" text[],
    parameters text,
    requiredbooking boolean DEFAULT false NOT NULL
);


ALTER TABLE public.spot OWNER TO postgres;

--
-- Name: spot_spotId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."spot_spotId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."spot_spotId_seq" OWNER TO postgres;

--
-- Name: spot_spotId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."spot_spotId_seq" OWNED BY public.spot."spotId";


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    clerk_user_id character varying,
    username character varying,
    email character varying,
    first_name character varying,
    last_name character varying,
    phone_number character varying,
    public_metadata character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    clerk_user_id text NOT NULL,
    username text,
    email text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "firstName" text,
    "lastName" text,
    "phoneNumber" text,
    "publicMetadata" text,
    id integer NOT NULL
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
-- Name: booking bookingId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking ALTER COLUMN "bookingId" SET DEFAULT nextval('public."booking_bookingId_seq"'::regclass);


--
-- Name: event eventId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event ALTER COLUMN "eventId" SET DEFAULT nextval('public."event_eventId_seq"'::regclass);


--
-- Name: park parkId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.park ALTER COLUMN "parkId" SET DEFAULT nextval('public."park_parkId_seq"'::regclass);


--
-- Name: payment paymentId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN "paymentId" SET DEFAULT nextval('public."payment_paymentId_seq"'::regclass);


--
-- Name: spot spotId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spot ALTER COLUMN "spotId" SET DEFAULT nextval('public."spot_spotId_seq"'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a30fec68-f989-4a5c-8abc-555584855033	65248c6fae7a6ff41312c41a3691e5258ee60925fbece9d9f7a2ce4edfca9e65	2024-10-03 00:43:27.999108-06	20241003064327_user_id_to_id	\N	\N	2024-10-03 00:43:27.978071-06	1
09af3614-0b9d-4f6b-8a3e-75dcd355e0f2	5a59cbffcb24445c416aecc80bb7d5ba4ec206d7e99506641fba2d9da0f1c45b	2024-09-23 16:27:07.468378-06	20240916203857_init	\N	\N	2024-09-23 16:27:07.448075-06	1
05a2eeb4-ea15-4e42-9e65-d7d56fe4e00b	12d8b6a8289dee62d501c606400303a0470d012273017956517c1979864de7f4	2024-09-30 10:06:27.861954-06	20240929002422_rename_id_fields	\N	\N	2024-09-30 10:06:27.846478-06	1
49a7f35b-4170-41dd-ab5b-4f2f82d4e174	22d46e193fee5f34658f71ff59755c6a1ad7bd558ce0831addad418288a5b29b	2024-09-23 16:27:07.485632-06	20240916222341_add_park_table	\N	\N	2024-09-23 16:27:07.471666-06	1
12e9013d-0852-44e1-afaa-e17e32b52e05	3ae1597629504711574862703a8788de4252f43593f2bca7bc39902684c819e5	2024-09-23 16:27:07.489387-06	20240917210423_init	\N	\N	2024-09-23 16:27:07.486841-06	1
01ab6bee-46d9-464f-96fc-a4ab4ec0160a	162e686bb7bf14d7f1116a5b0e6d5b528de757cd42ce56b0f6fb8f6dc8720029	2024-09-23 16:27:07.495036-06	20240920040941_add_clerk_user_fields	\N	\N	2024-09-23 16:27:07.4914-06	1
4b90459b-de7d-4702-bddd-d344377b97e1	9d86202e09bdfa9ad17e949bd19394dad294e7909f61c365c63a933fdb31be7a	2024-09-30 10:06:27.875926-06	20240929020447_add_relations_to_booking_and_payment	\N	\N	2024-09-30 10:06:27.862502-06	1
da9c3748-a8a1-41be-ad35-ab79457ce9af	962b0b6cbd8a426289cae8e8d46d4ba096073f68592dedc8f88d62fa0f82df8f	2024-09-23 16:27:07.498594-06	20240920052154_add_clerk_user_fields	\N	\N	2024-09-23 16:27:07.496203-06	1
9ba8a9bb-8b15-44d6-886a-4479fbac165f	4d7426a957634fc0da538b85a0020e2395a93f5f8e12a0fe1f89478c721960fd	2024-09-23 16:27:07.578878-06	20240922012231_init	\N	\N	2024-09-23 16:27:07.512835-06	1
1f76e205-0187-4b85-bb88-736e10f80378	604f8a4bc3d20fd251ca6e6ab6fa7a83320ad2320b67054c6a1d9f0e4707424a	2024-09-23 16:27:07.598708-06	20240922040955_update_park_spot_event_schema	\N	\N	2024-09-23 16:27:07.57967-06	1
bc85bf0f-deef-4178-b1fa-4a9bef6ee73b	46b5deede0f410f5e36ad10a10ea018ff935d51946047958917f60553c4ec79d	2024-09-30 10:06:27.882698-06	20240929024006_fix_user_id_to_id	\N	\N	2024-09-30 10:06:27.876519-06	1
c96423df-63dc-4889-98c6-2c3319af4f4f	73d826cbe66a594596a8192fcf7052cbadbd5d6e46297f75775f583b5959c68a	2024-09-23 16:28:49.697864-06	20240923222849_sync	\N	\N	2024-09-23 16:28:49.68967-06	1
4f4a0f7e-2af6-4288-a452-0e3bfa8ac5d9	42c71ea358ec6d26902edf597505c66f29310f908276748f152ec4776c814c2a	2024-09-23 17:20:12.100763-06	20240923232012_update_event_model	\N	\N	2024-09-23 17:20:12.086623-06	1
a672be55-541f-47a9-9c47-0566b291806c	abf4570d261590dd92a6fceab5336eb68f32a125b529d392d98ce7f3904b2e81	2024-09-24 00:54:24.792106-06	20240924065424_update_user_schema	\N	\N	2024-09-24 00:54:24.785484-06	1
ebf4991b-5a83-4e84-a42d-72220fcbe5e7	0453559161635b55ad87e186266b8e26a9cfdec3fca49a5fdd642417ab4d71a2	2024-09-30 10:06:34.698537-06	20240930160634_add_event_image_parameters	\N	\N	2024-09-30 10:06:34.696668-06	1
82f9d774-05d8-4bb4-903a-1e775bcf8407	50f5501970ad43e0935e79c7ded953fd2086dfe9e52fe0939ee438734320cc43	2024-09-24 22:25:00.870975-06	20240925042500_booking_add_start_end_time	\N	\N	2024-09-24 22:25:00.864585-06	1
24a6522d-bcee-4746-bdb0-441a24c5dad2	6145d5a835a9710b9ca391ebad12bccd8d6d7fdc584d6f4f092a30fef1a4df85	2024-09-27 22:59:11.785725-06	20240928045911_add_image_lat_long_for_googlemap	\N	\N	2024-09-27 22:59:11.780839-06	1
8c6ae826-0fd8-4391-9679-6f13c862e408	8402f4b0bfcc53c0317e8de5e143dd3b07fbcf94422ec3c1060cc3aeb076cbf9	2024-09-28 00:28:14.829174-06	20240928062814_add_spot_parameters	\N	\N	2024-09-28 00:28:14.823849-06	1
201bd4c1-6a3e-483a-8130-2ca40deae6c9	ca4b429b1bdbf8b90f7d8e313269796dcc91a3d1e928758c9d729138f9496d1f	2024-09-30 10:41:30.668191-06	20240930164130_add_requiredbooking	\N	\N	2024-09-30 10:41:30.664193-06	1
26bd98cc-e2bc-4848-a46a-f4adcc42c3d3	6b634addec08fbb57ed55df5c7604c266057ef3bf3131e5581a1fe7a6178674d	2024-09-30 16:14:59.014262-06	20240930221458_add_park_province_image	\N	\N	2024-09-30 16:14:59.010419-06	1
4ab3c732-36bd-4d30-8cbc-08f4307406ab	7dd93ee811b168277704f7012a55aed274dada63d63c23052edd0ad224a29573	2024-10-02 23:56:23.46234-06	20241003055623_sync_all	\N	\N	2024-10-02 23:56:23.427664-06	1
9ec0d050-8ba8-46a9-bef6-e943c416f77b	df2da7ceac64817036ff164e5e6d32bcff01c728d7a1d863d6e7d735c405cafe	2024-10-03 00:30:34.858133-06	20241003063034_sync_users	\N	\N	2024-10-03 00:30:34.837029-06	1
\.


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking ("bookingId", "spotId", "eventId", "bookingDate", "bookingStartTime", "bookingStatus", id) FROM stdin;
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event ("eventId", "parkId", "eventName", "eventLocation", fee, description, discount, "endDate", "startDate", "eventImageUrl", parameters, requiredbooking) FROM stdin;
1	1	Indigenous Voices	311 Cave Ave, Banff, AB T1L 1K2	9	Cave and Basin National Historic Site is honored to present a collection of artworks, exhibits and programs from vibrant Indigenous communities with traditional and contemporary connections to Banff (including y rhe Nakoda, Siksika, Kainai, Piikani, Tsuut ina, Ktunaxa, Secw pemc and M tis).	7.5	2024-10-15 00:00:00	2024-05-15 00:00:00	{https://wereintherockies.com/wp-content/uploads/2024/08/CBGiftshop.jpeg}	311 Cave Ave, Banff, AB T1L 1K2	f
2	1	Art In Nature Trail	Location Start at the Banff Park Museum	0	Banff's newest art exhibition isn't inside a gallery, and you don't need a ticket. It's part of the beauty of nature as you explore the Art in Nature Trail along the Bow River in Banff.	0	2024-09-30 00:00:00	2024-07-01 00:00:00	{https://banfflakelouise.bynder.com/m/911bfa88a9147f0/2000x1080_jpg-2023_Banff_ArtinNatureTrail_signage_RobertMassey%20(0).jpg}	\N	f
3	1	Fall Equinox Release & Reset Yoga Workshop	Banff Yoga Practice	60	Join Alyssa for a rejuvenating weekend of yoga, meditation, & journaling to send off summer and welcome in fall. Bringing her strong connection to nature, grounding energy, and a playful sense of curiosity to the mat, you will be guided through a journey of reflection and intention setting to rekindle your inner flame.	0	2024-09-22 00:00:00	2024-09-21 00:00:00	{https://www.risingfawngardens.com/wp-content/uploads/2022/07/mec-thumb-1026-362-IMG_0321-scaled.jpg}	\N	f
4	3	Downtown Foodie Tour	500 Connaught DrJasper, AB CanadaT0E 1E0	125	On this 1.5 KM downtown guided walk, you'll be visiting four restos and tasting four carefully handpicked dishes paired with four boozie treats and listening to Jasper's top tails along the way. What's on the menu? Not telling. It's all part of the adventure. Price includes food and drinks and gratuities at the restaurants. Tips for the guide is appreciated at your discretion.	0	2026-01-31 00:00:00	2024-09-28 00:00:00	{https://cdn.prod.website-files.com/65cd06b49d0a9fd5c7556909/661c2643b10c5b27b4fc9d03_Downtown-Foodie-Tour-700%20(Large).webp}	\N	f
\.


--
-- Data for Name: park; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.park ("parkId", name, description, location, parameters, "parkImageUrl", province) FROM stdin;
1	Banff National Park	Located in the Canadian Rockies in Alberta, Banff is the oldest national park, established in 1885. Known for its stunning mountain landscapes and turqouise lakes like Lake Louise, Banff attracts hundreds of thousands yearly for its natural beauty and endless recreational activities.	Improvement District No. 9, AB T0L	ChIJlZGSjCtmd1MR5tfKrGjincA	{../banff_parks.jpg}	Alberta
2	Elk Island National Park	Located in Alberta, Canada, this national park is a sanctuary for wildlife, known for its herds of bison. While relatively small, visitors can be expected to enjoy majestic views, diverse wildlife, and activities like hiking, camping, and stargazing.	54401 Range Rd 203, Fort Saskatchewan, AB T8L 0V3	ChIJvz5DI3NooFMRbSqByq7r8CM	{../elkisland_parks.jpg}	Alberta
3	Jasper National Park	Located in the Canadian Rockies in Alberta, Jasper is the largest national park in the region, covering over 11,000 square kilometers. Known for its stunning mountain scenery, glaciers, lakes, and wildlife, the park offers opportunities for hiking, camping, skiing, stargazing, and other activities.	Jasper, AB T0E 1E0	ChIJG4dCkcspg1MRktGbzm1KcuE	{../jasper_parks.jpg}	Alberta
4	Waterton Lakes National Park	Located in the southern part of Alberta, Waterton Lakes National Park boasts stunning landscapes where the prairies meet the Rocky Mountains. This national park offers beautiful lakes, diverse wildlife, and scenic hiking trails.	Waterton Park, AB T0K 2M0	ChIJv0mRixFDb1MRHFgDVHceYN8	{../waterton_parks.jpg}	Alberta
5	Glacier National Park	Located in British Columbia, Glacier National Park is known for its dramatic mountain landscapes, glaciers, and dense forests. The park is home to grizzly bears, mountain goats, and over 400 glaciers.	Columbia-Shuswap, BC V0X 1R0	ChIJxWd-JkUIeVMRuQ7amxSgRPA	{"..\\\\glacier-national-park.jpg"}	British Columbia
6	Gulf Islands National Park Reserve	Located in British Columbia, this park is an archipelago of small islands known for its scenic beauty, wildlife, and rich cultural history. The park offers activities like hiking, kayaking, wildlife viewing, and exploration opportunities of its forests, beaches, and marine ecosystems.	195-203 Narvaez Bay Rd, Saturna, BC V0N 2Y0	ChIJMzJ1ScT0hVQRAaIgIWVDwE0	{"..\\\\gulf-islands.jpg"}	British Columbia
7	Gwaii Haanas National Park Reserve, National Marine Conservation Area Reserve, and Haida Heritage Site	Located in the southern part of Haida Gwaii, an archipelago off the coast of British Columbia, this park is co managed by the Haida Nation and the Canadian government. The area is known for its cultural significance, with ancient Haida village sites, traditional totem poles, and stunning natural beauty.	Daajing Giids, BC V0T 1S0	ChIJg_uzAN4FbFQRaIKfTg-OnOs	{"..\\\\gwaii-haanas.jpg"}	British Columbia
8	Kootenay National Park	Located in southeastern British Columbia, this national park offers notable attractions like Marble Canyon, Radium Hot Springs, and the Paint Pots. The park offers diverse landscapes, rugged mountains, deep canyons, alpine meadows, and hot springs.	7556 Main St E, Radium Hot Springs , V0A 1E0	ChIJ_f9-6SYGelMRaZ4lDCFImk4	{"..\\\\Kootenay-National-Park.jpg"}	British Columbia
9	Mount Revelstoke National Park	Mount Revelstoke is located in British Columbia and is known for its mountain landscapes, alpine meadows, and dense temperate rainforests. Visitors can experience scenic drives, hikes, and diverse wildlife. 	Meadows in the Sky Pkwy, Revelstoke, BC V0E 2S0	ChIJyaLFSj48eVMRc4lvx8rhwJ0	{"..\\\\mount-revelstoke.jpg"}	British Columbia
10	Pacific Rim National Park Reserve	Located on Vancouver Island in British Columbia, this park is renowned for its stunning costal scenery and diverse ecosystems. It encompasses lush rainforests, rugged shorelines, and vibrant marine environments	Pacific Rim National Park Reserve, British Columbia	ChIJhTSXOx4-iVQRwUoXx5Xv8ic	{"..\\\\Pacific-Rim-National-Park.webp"}	British Columbia
11	Yoho National Park	Located in British Columbia, this park was established in 1886, spanning over 1,300 square kilometers, this park includes locations such as Emerald Lake and the breathtaking Takakkaw Falls, one of Canada's tallest waterfalls.	Field, BC V0A 1G0	ChIJUxBJITveeVMRdW-P2NvpnPI	{"..\\\\Yoho-National-Park-3.jpg"}	British Columbia
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment ("paymentId", "bookingId", "paymentStatus", id) FROM stdin;
\.


--
-- Data for Name: spot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spot ("spotId", "parkId", "spotName", "spotDescription", "spotAdmission", "spotDiscount", "spotLocation", "spotImageUrl", parameters, requiredbooking) FROM stdin;
311	3	Planetarium and Telescope Combo Tour	Discover the wonders of the night sky with our award-winning star-gazing tour package! Start your tour in the Planetarium Dome Theatre and explore local First Nations constellations, the Milky Way, and even the edge of the universe! 	72.45	26.25	1 Old Lodge Rd, Jasper, AB T0E 1E0, Canada	\N	\N	f
312	3	Columbia Icefield Tour with Glacier Skywalk	Discover the Glacier Skywalk and Athabasca Glacier aboard an ice explorer vehicle equipped to handle the rugged ice landscape. Frequent tour departures and flexible scheduling mean you wonΓÇÖt be tied down to a single tour time; that means you can secure your tickets in advance then show up on your own schedule.	124.97	80.54	93 Icefields Pkwy, Jasper, AB T0E 1E0, Canada	\N	\N	f
313	3	Guided Glacier Hike on The Athabasca with IceWalks	Enjoy the unique experience of walking on a glacier on this small-group tour. As your guide leads you across the majestic Athabasca Glacier in the Canadian Rockies you'll get insights into its many incredible ice formations such as crevasses, mill wells, meltwater streams, and icefalls. Equipment is provided and no technical climbing experience is required.	133.34	69.62	95446QCC+4P4, 95446QCC+4P	\N	\N	f
511	5	Half Day Scenic Float on the Middle Fork of the Flathead River	Take a break from sightseeing and rushing from place to place and spend a few hours floating on the Middle Fork of the Flathead River. This relaxing and rejuventating tour takes place on the boundary to Glacier National Park. Enjoy the scenery as you float and, with luck, spot some wildlife along the way.	75	55	106 Going-to-the-Sun Rd, West Glacier, MT 59936, USA	\N	\N	f
512	5	West Scenic & Polebridge Scenic Driving Tour	Enjoy comfortable, private transportation and a knowledgeable, experienced local guide. Your tour takes away the stress of driving around the park so you can enjoy the day with your family or travel group. Learn about the history of the park and the valley, enjoy the sights, and experience different areas of Glacier National Park. 	764.38	0	541 Spokane Ave, Whitefish, MT 59937, USA	\N	\N	f
513	5	Half-Day Glacier National Park Whitewater Rafting Adventure	See Glacier National Park in a way that few people get to with this half-day whitewater rafting tour. You'll get your bearings paddling through a calm stretch of water before making your way to the John Stevens Canyon, where you'll tackle a variety of thrilling rapids. A guide will be with you throughout your adventure and beginners are welcome to join in on the fun.	121.58	91.56	12127 US-2, West Glacier, MT 59936, USA	\N	\N	f
114	1	Lake Louise	Lake Louise is a hamlet in Banff National Park in the Canadian Rockies, known for its turqouise, glacier-fed lake ringed by high peaks and overlooked by a stately chateau.	0	0	Lake Louise Lakeshore Trail, Lake Louise, AB T0L	{"..\\\\lake-louise.jpg"}	lake+louise,alberta+canada	f
116	1	Moraine Lake	Moraine Lake┬áis a stunning turquoise lake, cradled by the Valley of the Ten Peaks, located in Banff National Park, Alberta, Canada.	0	0	Improvement District No. 9, AB	\N	moraine+lake,alberta+canada	f
112	1	Golden Skybridge	Walk this suspension bridge 426 feet above an expansive canyon, engulfed by the Columbia Valley.	49	31.85	503 Golden Donald Upper Road, Golden, BC, V0A 1H0	{"..\\\\golden-skybridge.jpg"}	golden+skybridge,bc+canada	f
115	1	Lake Minnewanka	Lake Minnewanka is a glacial lake in the eastern area of Banff National Park in Canada, about five kilometers northeast of the Banff townsite.	0	0	Lake Minnewanka Scenic Dr, Improvement District No. 9, AB T1L 1K2	{"..\\\\lake-minnewanka.jpg"}	lake+minnewanka,alberta+canada	f
316	3	Pyramid and Patricia Lakes	Subalpine forests and rocky mountain peaks create a stunning background for these two beautiful lakes. The reflection of Pyramid Mountain in the waters of Patricia Lake is a photo worth snapping! The highlight of Pyramid Lake is a walk across the bridge to Pyramid Island.	0	0	Pyramid Lake Rd, Jasper, Jasper National Park, Alberta T0E 1E0 Canada	\N	Pyramid+Patricia+Lakes,alberta+canada	f
413	4	Emerald Bay Scuba Dive	This sheltered bay is a day use park where scuba divers can explore the wreck of Gertrude, an old logging boat that sank in the bay.	0	0	On the edge of Waterton Townsite, 200 Vimy Ave, Waterton Park, AB T0K 2M0, Canada	{"..\\\\emerald-bay-scuba-dive.jpg"}	emerald+bay+scuba+dive,alberta+canada	f
113	1	Cave & Basin National Historic Site	Cave and Basin has been a special place for Indigenous peoples for over ten thousand years and continues to be so to this day. In 1883, three railway workers found the thermal springs, sparking a series of events that led to the creation of CanadaΓÇÖs first national park. Today, the site is a gathering place for sharing stories about conservation and the connection between people and the land in CanadaΓÇÖs national protected areas. Visit the Cave and Basin National Historic Site to experience the birthplace of CanadaΓÇÖs national parks and learn about the natural and cultural history of the mountains. Discover the hot water that seeps from the rocks, smell the minerals and explore the trails.	9	0	311 Cave Ave, Banff, AB T1L 1K2	{"..\\\\Cave-Basin-National-Historic-Site.jpg"}	cave+basin+national+historic+site,alberta+canada	f
515	5	East Glacier & Two Medicine Scenic Driving Tour	Leave behind worrying about Glacier National ParkΓÇÖs confusing reservation system and book a guided scenic driving tour that takes care of it all. YouΓÇÖll explore the parkΓÇÖs popular East Glacier and Two Medicine areas, witnessing spectacular spots like East Glacier Park Lodge and Two Medicine Lake. Your guide provides valuable insight along the way, ensuring you get the most out of your time in ΓÇ£The Crown of the Continent.ΓÇ¥	833.86	0	541 Spokane Ave, Whitefish, MT 59937, USA	\N	\N	f
611	6	Gulf Islands Kayak and Seaplane Adventure	Visit Victoria and its celebrated Buchart Gardens with a local guide by booking this day trip from Vancouver. You'll visit many of Victoria's most celebrated spots on a guided tour, and have free time to shop, grab lunch, and explore independently. For added convenience, all transportationΓÇöincluding ferry tickets and transfers from select Vancouver hotelsΓÇöis included.	789	599	Pickup is available from all hotels, private residences, and Airbnb in Vancouver.	\N	\N	f
612	6	Butchart Gardens & Victoria Tour from Vancouver	We are hosting cultural immersion retreats in Old Massett Community. Rejuvenate your body and calm your mind through wellness workshops; explore the regionΓÇÖs rugged landscape and learn about the local culture through artful experiences, tours and culinary delights.	274.86	142.71	Vancouver Cruise Pier, 999 Canada Pl, Vancouver, BC V6C 3E1, Canada	\N	\N	f
711	7	Cultural Immersion & Holistic Wellbeing on Haida Gwaii	We are hosting cultural immersion retreats in Old Massett Community. Rejuvenate your body and calm your mind through wellness workshops; explore the regionΓÇÖs rugged landscape and learn about the local culture through artful experiences, tours and culinary delights.	6500	6500	Airport pickup offered for Masset Airport, Masset, British Columbia of Canada	\N	\N	f
811	8	Kootenay National Park Day Tour from Calgary	CanadaΓÇÖs most stunning natural landscapes can be tough to navigate, but youΓÇÖll discover a pre-selected mix of self-guided walking trails, panoramic viewpoints, and canyon visits during this full-day tour to Kootenay National Park. Private, climate-controlled transportation from Banff or Calgary is included. Upgrade to include an optional soak in thermal waters at Radium Hot Springs.	210	205	Coast Calgary Downtown Hotel & Suites by APA, 610 4 Ave SW, Calgary, AB T2P 0K1, Canada OR Banff Aspen Lodge, 401 Banff Ave, Banff, AB T1L 1A9, Canada	\N	\N	f
812	8	Marble & Johnson Canyon Ice Walk Tour from Calgary/Canmore/Banff	See the both fascinating Marble and Johnston canyons of Banff! Do ice-walking with our local experienced guides and enjoy the gorgeous Canadian Rockies in a most unique way possible. Once in a lifetime experience.	155	155	Delta Hotels Calgary Downtown, 209 4 Ave SE, Calgary, AB T2G 0C6, Canada OR Canmore Inn & Suites, 1402 Bow Valley Trail, Canmore, AB T1W 1N5, Canada OR Banff Caribou Lodge & Spa, 521 Banff Ave, Banff, AB T1L 1H8, Canada	\N	\N	f
911	9	Half-Day Whitewater Rafting in Revelstoke	Enjoy a thrilling white-water rafting experience, and admire views of some of British ColumbiaΓÇÖs most spectacular scenery, when you book this beginner-friendly excursion. Pick between morning and afternoon tour times, and set off from central Revelstoke. After a training session, grab your gear and set off on the Illecillewaet River. Enjoy incredible vistas of the Selkirk Mountains as you chart the class II and III rapids with your guideΓÇÖs instruction.	173.25	173.25	12 1 St E, Revelstoke, BC V0E 2S0, Canada	\N	\N	f
912	9	Revelstoke Railway Museum	The museum showcases the historic construction and operation of the Canadian Pacific Railway in Western Canada's mountain region playing a pivotal role in the creation of Canada.	14	4	719 Track St W,┬á Revelstoke, BC.	\N	\N	f
1012	10	Cowichan Bay Half Day Whale & Wildlife Adventure	Gain a new perspective on Vancouver with a whale-watching tour through the Gulf Islands. Going with a guide ensures you see wildlife difficult to spot if on your own, including orca and humpback whales, porpoises, and bald eagles. A private tour, capped at 12 passengers ensures the full attention of your guide and a personal experience.	201.25	157.02	1721 Cowichan Bay Rd, Cowichan Bay, BC V0R 1N0, Canada	\N	\N	f
1111	11	Emerald Lake	Known as ΓÇ£Rainbow LakeΓÇ¥ by the First Nations, Emerald Lake┬áoffers a breathtaking view on its truly emerald-green water surrounded by Surprise Mountain and Mt Gilliam. Located along the┬áKlondike Highway, 12km north from Carcross.	0	0	Emerald Lake Road, Yoho National Park, British Columbia V0A 1G0 Canada	{"..\\\\Emerald-Lake.jpg"}	emerald+lake,ab+canada	f
1013	10	Radar Hill	As the site of a historic radar station during World War II, this short, picturesque walk features the Kap'Yong Memorial ΓÇô in honour of the 2nd Battalion Princess Patricia's Canadian Light Infantry, which served during the Korean War.	0	0	Alberni-Clayoquot, BC V0R 2Z0	\N	radar+hill,bc+canada	f
1014	10	Combers Beach	Located in Pacific Rim National Park, and situated near the Esowista First Nations Reserve, Combers Beach is┬áa beautiful beach area on Vancouver Island that is particularly popular with surfers. The trail to the beach is short but steep, and descends towards a gravelly path from the parking lot.	0	0	Alberni-Clayoquot, BC	\N	combers+beach,bc+canada	f
111	1	Banff Gondola	High above the town of Banff, you'll find yourself on the summit of Sulphur Mountain after 700 metres in elevation. The Banff Gondola is a popular destination for locals and tourists, displaying breathtaking views of Banff and offerring dining and other attractions once the summit is reached.	84	54.6	100 Mountain Ave, Banff, AB T1L 1B2	{"..\\\\Banff-Gondola.jpg"}	banff+gondola,alberta+canada	f
314	3	Maligne Canyon	A scenic limestone canyon with waterfalls and walking trails.	0	0	Maligne Lake Road, Jasper, Jasper National Park, Alberta T0E 1E0 Canada	{"..\\\\maligne-canyon.jpg"}	maligne+canyon,alberta+canada	f
211	2	Astotin Lake	Astotin Lake offers┬áa peaceful lakeside setting for your next picnic or family outing. The Astotin Lake area of Elk Island National Park has picnic shelters and tables, fire pits, drinking water and washrooms to make your picnic enjoyable and comfortable.	0	0	Improvement District No. 13, AB	\N	astotin+lake,alberta+canada	f
315	3	Athabasca Falls	A spectacular waterfall in Jasper National Park.	0	0	Improvement District No. 12, AB T0E 1E0	\N	athabasca+falls,alberta+canada	f
411	4	Waterton Village	A historic hamlet in the heart of the Southern Rockies. Embark on a journey of self-discovery just north of the U.S. border. Sitting on a lake enclosed by mountains, this picturesque town serves as hub to the stunning Waterton Lakes National Park	0	0	Waterton, AB T0K 2M0	\N	wateron+village,alberta+canada	f
1015	10	Bog Trail	On this trail┬áone walks on a level boardwalk that rests upon the bog surface┬áΓÇô no posts were driven into the sphagnum moss that carpets the forest floor. This trail is wheelchair accessible and pets are allowed provided they keep their owners on a leash.	0	0	Alberni-Clayoquot, BC V0R 3A0	{"..\\\\Bog-Trail.jpg"}	bog+trail,bc+canada	f
1112	11	Takakkaw Falls	┬áTakakkaw┬áFalls is the tallest waterfall in the Canadian┬áRockies┬áand┬áthe┬ásecond-tallest┬áin Canada.┬áAs┬áthe┬ásnow and ice melt in the early summer, they fuel the cascading water creating picturesque mist through the pines.	0	0	Yoho National Park, Field, BC V0A 1G0	{"..\\\\Takakkaw-Falls.jpg"}	takakaw+falls,bc+canada	f
913	9	The Enchanted Forest	The Enchanted Forest┬átheme park is situated in one of the BCΓÇÖs beautiful old growth forests in CanadaΓÇÖs┬áMonashee┬ámountains located midway between┬áRevelstoke, BC┬áand┬áSicamous, BC┬áon the┬áTrans Canada Highway.	11.2	7.2	7060 Trans-Canada Hwy, Revelstoke, BC V0E 2S0	\N	enchanted+forest,bc+canada	f
1011	10	Ucluelet Harbour Tour	Immerse yourself in some of British ColumbiaΓÇÖs s most spectacular seascapesΓÇöand enjoy an active way to exploreΓÇöon this small-group, half-day Ucluelet Harbour kayaking tour. Pick from several convenient start times, meet your guide on the waterfront, and get acquainted with your gear. Then, set off on the water. YouΓÇÖll learn about the regionΓÇÖs history and biodiversity, look out for wildlife like bears and eagles, and otherwise soak up the scenery.	110	99	200 Hemlock St, Ucluelet, BC V0R 3A0, Canada	\N	ucluelet+harbout+tour,bc+canada	f
1113	11	Kicking Horse River	Rising from the ice-cold glacial waters of Wapta Lake, and joined by the tributaries of the Yoho, Emerald, Amiskwi and Ottertail Rivers, the Kicking Horse falls steeply in its upper reaches before widening onto a flattened valley floor.	0	0	Columbia-Shuswap, BC	{"..\\\\Kicking-Horse-River.jpg"}	kicking+horse+river,bc+canada	f
412	4	Bears Hump	Bear's Hump Trail is the most popular trail in the Waterton Lakes National Park. The hike offers majestic views of the village, the Waterton Valley and Mount Cleveland (the highest peak of the Waterton-Glacier International Peace Park).	0	0	Waterton Park, AB T0K 2M0, Canada	\N	bears+hump,alberta+canada	f
212	2	Geo Domes	Escape in the wilderness in Elk Island Retreat in these geo domes designed to house a maximum of 2 adults.	249	0	54371 Range Rd 205, Fort Saskatchewan, AB T8L 3Z3	{"..\\\\geo-domes.jpg"}	geo+demoes,alberta+canada	f
414	4	Prince of Wales Hotel	The Prince of Wales was built by the Great Northern Railway in 1927 as an extension of the Glacier Park Lodges and today, stays true to its roots. From the furniture in the lobby to our Prohibition-inspired cocktail menu, the hotel is dotted with historic elements and period-specific inspiration.	0	0	AB-5, Waterton Park, AB T0K 2M0	{"..\\\\prince-wales-hotel.jpg"}	prince+of+wales+hotel,alberta+canada	f
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, clerk_user_id, username, email, first_name, last_name, phone_number, public_metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (clerk_user_id, username, email, created_at, "updatedAt", "firstName", "lastName", "phoneNumber", "publicMetadata", id) FROM stdin;
user_2mhsEtjWSKgPKRQmBH5WdzE7MIX		tannh.a2.2023@gmail.com	2024-10-03 06:30:52.974	2024-10-03 06:53:16.899	Nguyß╗àn	Tß║Ñn		{"publicMetadata":{"role":"visitor"}}	1
user_2mJBKNRZw0YlPCAlC7REZyQEJBY		admin@dcp.com	2024-10-03 06:30:52.984	2024-10-03 06:53:16.96				{"publicMetadata":{"role":"admin"}}	3
user_2mGPpdIkRGZJ2yzkgBLw8hPxCiu		angelicaverz31@gmail.com	2024-10-03 06:30:52.985	2024-10-03 06:53:16.978	angelica			{}	4
user_2m8CeH44LADOpPjr817SI9BH8AS		phatmreyes@gmail.com	2024-10-03 06:30:52.986	2024-10-03 06:53:16.993				{"publicMetadata":{"role":"visitor"}}	5
user_2m883lE9vTC5kahLmZBZXoMdcYJ		reyesamaris1@gmail.com	2024-10-03 06:30:52.987	2024-10-03 06:53:17				{"publicMetadata":{"role":"visitor"}}	6
user_2m7z4flWnoKrrJIbzvL5mZT83EK		laceelliana@gmail.com	2024-10-03 06:30:52.989	2024-10-03 06:53:17.031	Test	Test		{"publicMetadata":{"role":"visitor"}}	7
user_2m7w7Ddj37QvbMk2eUKXH57H68q		ruth.reyes3121@gmail.com	2024-10-03 06:30:52.99	2024-10-03 06:53:17.054				{"publicMetadata":{"role":"visitor"}}	8
user_2m5gfYg1S7MEXEZYdTrmnEECkRZ		ruth.reyes112131@gmail.com	2024-10-03 06:30:52.991	2024-10-03 06:53:17.059				{"publicMetadata":{"role":"visitor"}}	9
user_2m30FUQM88oXNnxd9uX7KGXIABf		ruth.miguel@yahoo.com	2024-10-03 06:30:52.992	2024-10-03 06:53:17.107				{"publicMetadata":{"role":"visitor"}}	10
user_2mJro3ANrtTwKVDsmH3uhFXxaNS		visitor@dcp.com	2024-10-03 06:30:52.982	2024-10-04 21:59:10.166	Visitor	Admin can you see 	2	{"publicMetadata":{"role":"visitor"}}	2
\.


--
-- Name: booking_bookingId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."booking_bookingId_seq"', 1, false);


--
-- Name: event_eventId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."event_eventId_seq"', 1, false);


--
-- Name: park_parkId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."park_parkId_seq"', 2, true);


--
-- Name: payment_paymentId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."payment_paymentId_seq"', 1, false);


--
-- Name: spot_spotId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."spot_spotId_seq"', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 30, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY ("bookingId");


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY ("eventId");


--
-- Name: park park_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.park
    ADD CONSTRAINT park_pkey PRIMARY KEY ("parkId");


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY ("paymentId");


--
-- Name: spot spot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spot
    ADD CONSTRAINT spot_pkey PRIMARY KEY ("spotId");


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_user_clerk_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_user_clerk_user_id ON public."user" USING btree (clerk_user_id);


--
-- Name: ix_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_user_email ON public."user" USING btree (email);


--
-- Name: ix_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_user_id ON public."user" USING btree (id);


--
-- Name: ix_user_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_user_username ON public."user" USING btree (username);


--
-- Name: payment_bookingId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payment_bookingId_key" ON public.payment USING btree ("bookingId");


--
-- Name: users_clerk_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_clerk_user_id_key ON public.users USING btree (clerk_user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: booking booking_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public.event("eventId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: booking booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: booking booking_spotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "booking_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES public.spot("spotId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: event event_parkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT "event_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES public.park("parkId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment payment_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT "payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public.booking("bookingId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spot spot_parkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spot
    ADD CONSTRAINT "spot_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES public.park("parkId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

