-- Insert sample bus route data
INSERT INTO public.bus_routes (service_id, origin, destination, stops) VALUES
('XG431', 'Ferrol E.F.', 'Ortigueira E.F.', ARRAY['Ferrol E.F.', 'Narón', 'Neda', 'Fene', 'Cabanas', 'Pontedeume', 'Miño', 'Betanzos', 'Curtis', 'Ortigueira E.F.']),
('XG432', 'Cerdido E.F.', 'Ferrol E.F.', ARRAY['Cerdido E.F.', 'San Sadurniño', 'Moeche', 'Narón', 'Ferrol E.F.']),
('XG433', 'Ferrol E.F.', 'San Sadurniño E.F.', ARRAY['Ferrol E.F.', 'Narón', 'Neda', 'San Sadurniño E.F.']),
('XG434', 'Ferrol E.F.', 'Xuvia E.F.', ARRAY['Ferrol E.F.', 'O Alto do Castiñeiro', 'Narón', 'Xuvia E.F.']),
('XG63500101', 'Ferrol E.A.', 'Hospital da Costa (Burela)', ARRAY['Ferrol E.A.', 'Narón', 'Xuvia', 'San Sadurniño', 'Moeche', 'Ortigueira', 'Espasante', 'O Barqueiro', 'Viveiro', 'Covas', 'Celeiro', 'Burela (Hospital da Costa)']),
('XG64000101', 'Praza de Galicia', 'Cedeira E.A.', ARRAY['Praza de Galicia', 'A Gándara', 'Alto do Castiñeiro', 'Polígono Río do Pozo', 'Valdoviño', 'Meirás', 'Cedeira E.A.']),
('XG64000201', 'Praza de Galicia', 'Praia da Frouxeira → Cedeira E.A.', ARRAY['Praza de Galicia', 'A Gándara', 'Polígono Río do Pozo', 'Porta do Sol (Concello)', 'Praia da Frouxeira', 'Valdoviño', 'Cedeira E.A.']),
('XG64000301', 'Praza de Galicia', 'Vilaboa', ARRAY['Praza de Galicia', 'Narón', 'O Alto do Castiñeiro', 'Río do Pozo', 'Vilaboa']),
('XG64001701', 'Praza de Galicia', 'Castro → Praia da Frouxeira', ARRAY['Praza de Galicia', 'Castro', 'Porta do Sol (Concello)', 'Praia da Frouxeira']),
('XG64001801', 'Praza de Galicia', 'Sedes → Praia da Frouxeira', ARRAY['Praza de Galicia', 'Sedes', 'Porta do Sol (Concello)', 'Praia da Frouxeira']);