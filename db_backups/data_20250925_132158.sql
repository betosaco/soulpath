--
-- PostgreSQL database dump
--

\restrict CzHVgmC24nwngBva8a3zRqQOb4KAFZ7ZE6uSFwnCEgp07hvMsAArOjv7kDE2nPD

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: MatMax; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MatMax" (id, created_at) FROM stdin;
\.


--
-- Data for Name: ab_test_experiments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ab_test_experiments (id, experiment_name, model_a_version, model_b_version, traffic_split, start_date, end_date, status, success_metric, winning_model_version, final_results) FROM stdin;
\.


--
-- Data for Name: ab_test_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ab_test_assignments (id, experiment_id, session_id, assigned_model, created_at) FROM stdin;
\.


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.amenities (id, name, description, icon, category, is_active, display_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: api_config_audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_config_audits (id, config_id, action, old_values, new_values, performed_by, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currencies (id, code, name, symbol, is_default, exchange_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, full_name, avatar_url, role, phone, status, birth_date, birth_time, birth_place, question, language, admin_notes, scheduled_date, scheduled_time, session_type, last_reminder_sent, last_booking, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, billing_document_type, dni, ruc, company_name, status, payment_status, shipping_status, subtotal, tax_amount, shipping_amount, discount_amount, total, currency, notes, shipping_address, billing_address, payment_method, payment_id, tracking_number, shipped_at, delivered_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: session_durations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session_durations (id, name, duration_minutes, description, is_active, created_at, updated_at) FROM stdin;
1	1 Hour	60	Standard 1-hour wellness class	t	2025-09-22 07:34:58.096+00	2025-09-22 07:34:58.096+00
\.


--
-- Data for Name: package_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_definitions (id, name, description, sessions_count, session_duration_id, package_type, max_group_size, is_active, is_popular, display_order, featured, is_global, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: package_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_prices (id, package_definition_id, currency_id, price, pricing_mode, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, short_description, sku, price, compare_price, cost_price, currency, stock, min_stock, max_stock, weight, dimensions, category, tags, images, status, is_digital, is_featured, is_popular, seo_title, seo_description, slug, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, item_type, product_id, package_price_id, quantity, price, total, package_metadata, created_at) FROM stdin;
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchases (id, user_id, total_amount, currency, currency_code, payment_status, payment_method, payment_id, purchased_at, confirmed_at, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venues (id, name, description, address, city, country, capacity, max_group_size, is_active, display_order, featured, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schedule_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_templates (id, venue_id, day_of_week, start_time, end_time, capacity, is_available, session_duration_id, auto_available, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schedule_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_slots (id, schedule_template_id, start_time, end_time, capacity, booked_count, is_available, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_types (id, name, description, short_description, category, duration, max_participants, min_participants, requirements, benefits, difficulty, price, currency_id, is_active, display_order, featured, color, icon, cover_image, gallery_images, video_url, thumbnail_url, content, highlights, meta_title, meta_description, slug, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, name, email, phone, bio, short_bio, experience, avatar_url, cover_image, gallery_images, video_url, thumbnail_url, website, instagram, facebook, linkedin, teaching_style, philosophy, approach, max_students, min_students, preferred_times, is_active, display_order, featured, slug, meta_title, meta_description, created_at, updated_at, venue_id) FROM stdin;
\.


--
-- Data for Name: teacher_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_schedules (id, teacher_id, venue_id, service_type_id, day_of_week, start_time, end_time, is_available, max_bookings, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: teacher_schedule_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_schedule_slots (id, teacher_schedule_id, start_time, end_time, is_available, booked_count, max_bookings, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_packages (id, user_id, order_item_id, package_price_id, purchase_id, quantity, sessions_used, is_active, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, user_id, user_package_id, schedule_slot_id, teacher_schedule_slot_id, venue_id, teacher_id, service_type_id, session_type, status, notes, cancelled_at, cancelled_reason, reminder_sent, reminder_sent_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bug_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bug_reports (id, title, description, screenshot, annotations, status, priority, category, reporter_id, assigned_to, created_at, updated_at, resolved_at, archived_at) FROM stdin;
\.


--
-- Data for Name: bug_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bug_comments (id, content, author_id, bug_report_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: communication_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communication_config (id, created_at, updated_at, email_enabled, brevo_api_key, sender_email, sender_name, admin_email, sms_enabled, sms_provider, labsmobile_username, labsmobile_token, sms_sender_name, order_confirmation_template_id, booking_confirmation_template_id) FROM stdin;
\.


--
-- Data for Name: communication_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communication_templates (id, template_key, name, description, type, category, is_active, is_default, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: communication_template_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communication_template_translations (id, template_id, language, subject, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content (id, hero_title_en, hero_title_es, hero_subtitle_en, hero_subtitle_es, about_title_en, about_title_es, about_content_en, about_content_es, approach_title_en, approach_title_es, approach_content_en, approach_content_es, services_title_en, services_title_es, services_content_en, services_content_es, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: conversation_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversation_logs (id, session_id, user_id, user_message, bot_response, "timestamp", rasa_intent, rasa_confidence, rasa_entities, response_generator, booking_step, booking_data_snapshot, model_version) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, user_id, email, first_name, last_name, phone, date_of_birth, total_orders, total_spent, last_order_at, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_templates (id, template_key, subject, body, language, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: external_api_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.external_api_configs (id, name, provider, category, api_key, api_secret, api_url, webhook_url, webhook_secret, config, is_active, test_mode, description, version, rate_limit, timeout, last_tested_at, last_test_result, health_status, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, question, answer, category, is_active, display_order, created_at, updated_at, service_type_id, teacher_id) FROM stdin;
\.


--
-- Data for Name: group_booking_tiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_booking_tiers (id, name, min_participants, max_participants, discount_percent, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, name, url, alt_text, category, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_logs (id, product_id, type, quantity, reason, reference, notes, created_at) FROM stdin;
\.


--
-- Data for Name: kv_store_f839855f; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kv_store_f839855f (key, value) FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (id, name, code, native_name, is_active, display_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: logo_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logo_settings (id, type, text, image_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ml_model_performance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ml_model_performance (id, model_version, evaluation_results, booking_success_rate, avg_conversation_turns, deployment_date, is_active_production, is_active_ab_test, created_at) FROM stdin;
\.


--
-- Data for Name: order_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_history (id, order_id, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: otp_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_verifications (id, user_id, phone_number, country_code, otp_code, is_verified, expires_at, attempts, max_attempts, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: package_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_services (id, package_definition_id, service_type_id, sessions_included, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_method_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_method_configs (id, name, type, description, icon, requires_confirmation, auto_assign_package, is_active, created_at, updated_at, provider_config) FROM stdin;
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, name, description, currency_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_records (id, purchase_id, user_id, amount, currency, payment_method, payment_id, status, payment_status, transaction_id, gateway_response, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: profile_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profile_images (id, key, url, alt_text, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rates (id, currency_id, session_duration_id, session_type, base_price, group_discount_percent, min_group_size, max_group_size, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, section_id, type, title, description, icon, component, "order", enabled, mobile_config, desktop_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: seo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seo (id, title, description, keywords, og_image, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_prices (id, price, currency, pricing_type, is_active, valid_from, valid_to, created_at, updated_at, service_type_id, venue_id, teacher_id, package_definition_id) FROM stdin;
\.


--
-- Data for Name: sms_configurations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sms_configurations (id, provider, username, token_api, sender_name, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specialties (id, name, description, category, service_type_id, is_active, display_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: teacher_certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_certifications (id, teacher_id, name, issuing_organization, issue_date, expiry_date, credential_id, credential_url, description, is_verified, display_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: teacher_languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_languages (id, teacher_id, language_id, created_at) FROM stdin;
\.


--
-- Data for Name: teacher_service_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_service_types (id, teacher_id, service_type_id, created_at) FROM stdin;
\.


--
-- Data for Name: teacher_specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_specialties (id, teacher_id, specialty_id, service_type_id, level, years_experience, certification, certification_date, notes, is_verified, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: telegram_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telegram_users (id, user_id, telegram_chat_id, telegram_user_id, telegram_username, telegram_first_name, telegram_last_name, is_active, last_interaction, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testimonials (id, text, author_name, author_title, author_image, rating, is_verified, is_active, display_order, created_at, updated_at, service_type_id, teacher_id) FROM stdin;
\.


--
-- Data for Name: user_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_feedback (id, conversation_log_id, session_id, rating, comment, created_at, reviewed_for_training) FROM stdin;
\.


--
-- Data for Name: venue_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venue_amenities (id, venue_id, amenity_id, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-09-22 05:10:04
20211116045059	2025-09-22 05:10:07
20211116050929	2025-09-22 05:10:09
20211116051442	2025-09-22 05:10:11
20211116212300	2025-09-22 05:10:14
20211116213355	2025-09-22 05:10:16
20211116213934	2025-09-22 05:10:18
20211116214523	2025-09-22 05:10:21
20211122062447	2025-09-22 05:10:23
20211124070109	2025-09-22 05:10:25
20211202204204	2025-09-22 05:10:27
20211202204605	2025-09-22 05:10:29
20211210212804	2025-09-22 05:10:35
20211228014915	2025-09-22 05:10:38
20220107221237	2025-09-22 05:10:40
20220228202821	2025-09-22 05:10:42
20220312004840	2025-09-22 05:10:44
20220603231003	2025-09-22 05:10:47
20220603232444	2025-09-22 05:10:49
20220615214548	2025-09-22 05:10:51
20220712093339	2025-09-22 05:10:53
20220908172859	2025-09-22 05:10:55
20220916233421	2025-09-22 05:10:57
20230119133233	2025-09-22 05:11:00
20230128025114	2025-09-22 05:11:02
20230128025212	2025-09-22 05:11:04
20230227211149	2025-09-22 05:11:06
20230228184745	2025-09-22 05:11:08
20230308225145	2025-09-22 05:11:10
20230328144023	2025-09-22 05:11:12
20231018144023	2025-09-22 05:11:15
20231204144023	2025-09-22 05:11:18
20231204144024	2025-09-22 05:11:20
20231204144025	2025-09-22 05:11:22
20240108234812	2025-09-22 05:11:24
20240109165339	2025-09-22 05:11:26
20240227174441	2025-09-22 05:11:30
20240311171622	2025-09-22 05:11:33
20240321100241	2025-09-22 05:11:37
20240401105812	2025-09-22 05:11:43
20240418121054	2025-09-22 05:11:46
20240523004032	2025-09-22 05:11:53
20240618124746	2025-09-22 05:11:55
20240801235015	2025-09-22 05:11:57
20240805133720	2025-09-22 05:11:59
20240827160934	2025-09-22 05:12:01
20240919163303	2025-09-22 05:12:04
20240919163305	2025-09-22 05:12:06
20241019105805	2025-09-22 05:12:08
20241030150047	2025-09-22 05:12:15
20241108114728	2025-09-22 05:12:18
20241121104152	2025-09-22 05:12:20
20241130184212	2025-09-22 05:12:23
20241220035512	2025-09-22 05:12:25
20241220123912	2025-09-22 05:12:27
20241224161212	2025-09-22 05:12:29
20250107150512	2025-09-22 05:12:31
20250110162412	2025-09-22 05:12:33
20250123174212	2025-09-22 05:12:35
20250128220012	2025-09-22 05:12:37
20250506224012	2025-09-22 05:12:38
20250523164012	2025-09-22 05:12:40
20250714121412	2025-09-22 05:12:42
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-09-22 05:10:01.191181
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-09-22 05:10:01.204279
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-09-22 05:10:01.214083
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-09-22 05:10:01.345789
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-09-22 05:10:01.778204
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-09-22 05:10:01.784058
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-09-22 05:10:01.789933
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-09-22 05:10:01.796327
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-09-22 05:10:01.80129
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-09-22 05:10:01.806395
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-09-22 05:10:01.813209
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-09-22 05:10:01.818875
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-09-22 05:10:01.829659
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-09-22 05:10:01.864816
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-09-22 05:10:01.885953
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-09-22 05:10:02.276603
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-09-22 05:10:02.285127
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-09-22 05:10:02.293414
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-09-22 05:10:02.313226
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-09-22 05:10:02.330108
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-09-22 05:10:02.335528
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-09-22 05:10:02.343493
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-09-22 05:10:02.411692
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-09-22 05:10:02.672549
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-09-22 05:10:02.699432
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-09-22 05:10:02.720025
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: MatMax_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MatMax_id_seq"', 1, false);


--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ab_test_assignments_id_seq', 1, false);


--
-- Name: ab_test_experiments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ab_test_experiments_id_seq', 1, false);


--
-- Name: amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.amenities_id_seq', 1, false);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- Name: communication_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.communication_config_id_seq', 1, false);


--
-- Name: communication_template_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.communication_template_translations_id_seq', 1, false);


--
-- Name: communication_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.communication_templates_id_seq', 1, false);


--
-- Name: content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.content_id_seq', 1, false);


--
-- Name: conversation_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversation_logs_id_seq', 1, false);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currencies_id_seq', 1, false);


--
-- Name: email_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_templates_id_seq', 1, false);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_id_seq', 1, false);


--
-- Name: group_booking_tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_booking_tiers_id_seq', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 1, false);


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.languages_id_seq', 1, false);


--
-- Name: logo_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logo_settings_id_seq', 1, false);


--
-- Name: ml_model_performance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ml_model_performance_id_seq', 1, false);


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_verifications_id_seq', 1, false);


--
-- Name: package_definitions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_definitions_id_seq', 1, false);


--
-- Name: package_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_prices_id_seq', 1, false);


--
-- Name: package_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_services_id_seq', 1, false);


--
-- Name: payment_method_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_method_configs_id_seq', 1, false);


--
-- Name: payment_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_methods_id_seq', 1, false);


--
-- Name: payment_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_records_id_seq', 1, false);


--
-- Name: profile_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profile_images_id_seq', 1, false);


--
-- Name: purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchases_id_seq', 1, false);


--
-- Name: rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rates_id_seq', 1, false);


--
-- Name: schedule_slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_slots_id_seq', 1, false);


--
-- Name: schedule_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_templates_id_seq', 1, false);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 1, false);


--
-- Name: seo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seo_id_seq', 1, false);


--
-- Name: service_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_prices_id_seq', 1, false);


--
-- Name: service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_types_id_seq', 1, false);


--
-- Name: session_durations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_durations_id_seq', 1, false);


--
-- Name: sms_configurations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sms_configurations_id_seq', 1, false);


--
-- Name: specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.specialties_id_seq', 1, false);


--
-- Name: teacher_certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_certifications_id_seq', 1, false);


--
-- Name: teacher_languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_languages_id_seq', 1, false);


--
-- Name: teacher_schedule_slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_schedule_slots_id_seq', 1, false);


--
-- Name: teacher_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_schedules_id_seq', 1, false);


--
-- Name: teacher_service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_service_types_id_seq', 1, false);


--
-- Name: teacher_specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_specialties_id_seq', 1, false);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 1, false);


--
-- Name: telegram_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.telegram_users_id_seq', 1, false);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 1, false);


--
-- Name: user_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_feedback_id_seq', 1, false);


--
-- Name: user_packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_packages_id_seq', 1, false);


--
-- Name: venue_amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venue_amenities_id_seq', 1, false);


--
-- Name: venues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venues_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict CzHVgmC24nwngBva8a3zRqQOb4KAFZ7ZE6uSFwnCEgp07hvMsAArOjv7kDE2nPD

