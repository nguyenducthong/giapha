package com.giaphaviet.config;

import com.giaphaviet.model.*;
import com.giaphaviet.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FamilyTreeRepository familyTreeRepository;
    private final PersonRepository personRepository;
    private final ParentChildRelationshipRepository relationshipRepository;
    private final ClanArticleRepository articleRepository;
    private final EditProposalRepository proposalRepository;
    private final MediaAssetRepository mediaRepository;
    private final ClanEventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            FamilyTreeRepository familyTreeRepository,
            PersonRepository personRepository,
            ParentChildRelationshipRepository relationshipRepository,
            ClanArticleRepository articleRepository,
            EditProposalRepository proposalRepository,
            MediaAssetRepository mediaRepository,
            ClanEventRepository eventRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.familyTreeRepository = familyTreeRepository;
        this.personRepository = personRepository;
        this.relationshipRepository = relationshipRepository;
        this.articleRepository = articleRepository;
        this.proposalRepository = proposalRepository;
        this.mediaRepository = mediaRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (familyTreeRepository.count() > 0) {
            return;
        }

        // 1. Create Default Admin User
        User admin = new User("admin@giaphaviet.vn", passwordEncoder.encode("Admin@123456"), "Quản Trị Viên Hệ Thống");
        admin.setSuperAdmin(true);
        userRepository.save(admin);

        // 2. Create Default Family Tree
        FamilyTree tree = new FamilyTree();
        tree.setSlug("nguyen-dai-toc-co-do");
        tree.setName("Gia Phả Họ Nguyễn Đại Tộc");
        tree.setAncestralHall("Từ Đường Nguyễn Tộc – Thôn Cổ Đô");
        tree.setOriginPlace("Xã Cổ Đô, Huyện Ba Vì, TP. Hà Nội");
        tree.setFoundedYear(1682);
        tree.setCoupletText("Mộc xuất thiên chi do hữu bản – Thủy lưu vạn phái tổng đồng nguyên");
        tree.setHistorySummary("Dòng họ Nguyễn Đại Tộc khởi phát từ cuối thế kỷ XVII tại đất địa linh nhân kiệt Ba Vì. Trải qua hơn ba trăm năm với nhiều thăng trầm lịch sử, dòng họ luôn giữ vững gia phong lễ giáo, hiếu học thành tài.");
        tree.setPatriarchName("Ông Nguyễn Trọng Tuyên (Đời 4 – Trưởng Tộc)");
        tree.setPublic(true);
        FamilyTree savedTree = familyTreeRepository.save(tree);
        UUID treeId = savedTree.getId();

        // 3. Create Key Persons
        // Đời 1
        Person p1 = new Person();
        p1.setTreeId(treeId);
        p1.setPrimaryName("Nguyễn Quý Công");
        p1.setCourtesyName("Đức Hưng Tiên Sinh");
        p1.setGender("MALE");
        p1.setGeneration(1);
        p1.setStatus("DECEASED");
        p1.setOrderInFamily("Thủy Tổ");
        p1.setBranchName("Thủy Tổ Khai Sáng");
        p1.setBirthYear(1682);
        p1.setDeathYear(1754);
        p1.setLunarDeathDate("15/08 Âm lịch");
        p1.setLunarDeathCanChi("Giáp Tuất");
        p1.setTombLocation("Khu Lăng Cụ Thủy Tổ - Gò Phượng Hoàng");
        p1.setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80");
        p1.setBiography("Bậc Khai Sáng dòng họ Nguyễn Cổ Đô.");
        Person savedP1 = personRepository.save(p1);

        Person p2 = new Person();
        p2.setTreeId(treeId);
        p2.setPrimaryName("Lê Thị Diệu Thuần");
        p2.setCourtesyName("Diệu Thục Phu Nhân");
        p2.setGender("FEMALE");
        p2.setGeneration(1);
        p2.setStatus("DECEASED");
        p2.setOrderInFamily("Chính Thất");
        p2.setBranchName("Thủy Tổ Khai Sáng");
        p2.setBirthYear(1686);
        p2.setDeathYear(1760);
        p2.setLunarDeathDate("06/03 Âm lịch");
        p2.setLineage(false);
        p2.setMaternalClanName("Lê Tộc");
        p2.setMaternalOriginPlace("Thôn Cổ Đô, Xã Cổ Đô, Huyện Ba Vì, TP. Hà Nội");
        p2.setMaternalFather("Cụ Lê Văn Giáp (Tri phủ Quốc Oai)");
        p2.setMaternalMother("Cụ Bà Trần Thị Đoan (Nhũ danh Thục Đức)");
        p2.setMaternalNotes("Bà là con gái thứ ba của Cụ Tri phủ Lê Văn Giáp, trâm anh thế phiệt, hiền thục nết na, phụ đức vẹn toàn.");
        Person savedP2 = personRepository.save(p2);

        // Đời 2
        Person p3 = new Person();
        p3.setTreeId(treeId);
        p3.setPrimaryName("Nguyễn Trọng Phúc");
        p3.setGender("MALE");
        p3.setGeneration(2);
        p3.setStatus("DECEASED");
        p3.setOrderInFamily("Trưởng Nam");
        p3.setBranchName("Chi Trưởng (Ngành 1)");
        p3.setBirthYear(1715);
        p3.setDeathYear(1782);
        p3.setLunarDeathDate("12/10 Âm lịch");
        p3.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");
        Person savedP3 = personRepository.save(p3);

        Person p4 = new Person();
        p4.setTreeId(treeId);
        p4.setPrimaryName("Nguyễn Trọng Thọ");
        p4.setGender("MALE");
        p4.setGeneration(2);
        p4.setStatus("DECEASED");
        p4.setOrderInFamily("Thứ Nam");
        p4.setBranchName("Chi Hai (Ngành 2)");
        p4.setBirthYear(1722);
        p4.setDeathYear(1795);
        p4.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80");
        Person savedP4 = personRepository.save(p4);

        // Đời 3
        Person p5 = new Person();
        p5.setTreeId(treeId);
        p5.setPrimaryName("Nguyễn Văn Hòa");
        p5.setGender("MALE");
        p5.setGeneration(3);
        p5.setStatus("DECEASED");
        p5.setOrderInFamily("Trưởng Chi 1");
        p5.setBranchName("Chi Trưởng (Ngành 1)");
        p5.setBirthYear(1750);
        p5.setDeathYear(1823);
        p5.setLunarDeathDate("12/03 Âm lịch");
        p5.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80");
        Person savedP5 = personRepository.save(p5);

        // Đời 4
        Person p6 = new Person();
        p6.setTreeId(treeId);
        p6.setPrimaryName("Nguyễn Trọng Tuyên");
        p6.setCourtesyName("Đức Thành");
        p6.setGender("MALE");
        p6.setGeneration(4);
        p6.setStatus("LIVING");
        p6.setOrderInFamily("Trưởng Tộc Đương Nhiệm");
        p6.setBranchName("Chi Trưởng (Ngành 1)");
        p6.setBirthYear(1942);
        p6.setCurrentResidence("Cổ Đô, Ba Vì, Hà Nội");
        p6.setAvatarUrl("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80");
        Person savedP6 = personRepository.save(p6);

        // 4. Create Relationships (Marriage & Parent-Child)
        relationshipRepository.save(new ParentChildRelationship(treeId, savedP1.getId(), savedP2.getId(), "MARRIAGE"));
        relationshipRepository.save(new ParentChildRelationship(treeId, savedP1.getId(), savedP3.getId(), "BIOLOGICAL"));
        relationshipRepository.save(new ParentChildRelationship(treeId, savedP1.getId(), savedP4.getId(), "BIOLOGICAL"));
        relationshipRepository.save(new ParentChildRelationship(treeId, savedP3.getId(), savedP5.getId(), "BIOLOGICAL"));
        relationshipRepository.save(new ParentChildRelationship(treeId, savedP5.getId(), savedP6.getId(), "BIOLOGICAL"));

        // 5. Seed Clan Articles (Phả ký)
        articleRepository.save(new ClanArticle(
                treeId,
                "Lời Tựa Cuốn Gia Phả Khắc Gỗ Năm Cảnh Thịnh Thứ 8 (1800)",
                "Cụ Nguyễn Trọng Phúc ghi chép",
                "PHA_KY",
                "Nguyên văn bài tựa bằng chữ Nho khắc trên bản gỗ thị, nói về cội nguồn và đạo hiếu truyền đời.",
                "Cây có cội mới tốt tươi cành lá, nước có nguồn mới chảy xiết muôn trùng. Con người sinh ra ở đời, có tổ tiên ông bà mới có thân mình hôm nay..."
        ));
        articleRepository.save(new ClanArticle(
                treeId,
                "Kiến Trúc Độc Đáo Của Nhà Thờ Họ Nguyễn Tại Ba Vì",
                "Ban Văn Hóa Dòng Họ",
                "DI_TICH",
                "Ngôi từ đường 3 gian 2 chái bằng gỗ lim cổ thụ hơn 200 năm tuổi với bộ vì kèo chạm khắc rồng mây tinh xảo.",
                "Nhà thờ họ Nguyễn Đại Tộc được khởi dựng vào cuối thế kỷ XVIII và đại tu vào năm 1823. Công trình mang đậm phong cách kiến trúc xứ Đoài..."
        ));

        // 6. Seed Edit Proposals (Kiểm duyệt chỉnh sửa)
        proposalRepository.save(new EditProposal(
                treeId,
                savedP2.getId(),
                "Lê Thị Diệu Thuần",
                "Nguyễn Quốc Hùng (Đời 5)",
                "Nơi an táng",
                "Gò Phượng Hoàng",
                "Khu lăng Cụ Thủy Tổ - Gò Phượng Hoàng (Mộ Đôi)",
                "Theo gia phả chữ Nho bản dịch mới và khảo sát thực địa khu lăng mộ năm 2024"
        ));

        // 7. Seed Media Assets (Thư viện số)
        mediaRepository.save(new MediaAsset(
                treeId,
                "Chính Điện Nhà Thờ Tổ Nguyễn Tộc",
                "PHOTO",
                "https://images.unsplash.com/photo-1548625361-195fe57876a4?auto=format&fit=crop&w=600&q=80",
                "Nơi phụng thờ bát hương Thủy Tổ và các bậc Tiền Hiền dòng họ",
                2024
        ));
        mediaRepository.save(new MediaAsset(
                treeId,
                "Phục Chế Chân Dung Cụ Thủy Tổ Nguyễn Quý Công",
                "ALTAR_RESTORED",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
                "Ảnh thờ phục chế bằng công nghệ AI từ ảnh truyền thần cổ",
                2025
        ));

        // 8. Seed Events (Lịch Giỗ & Sự kiện)
        eventRepository.save(new ClanEvent(
                treeId,
                savedP1.getId(),
                "Lễ Giỗ Cụ Thủy Tổ Nguyễn Quý Công (Tổ Khởi Cơ)",
                "DEATH_ANNIVERSARY",
                "15/08 Âm lịch",
                "Từ đường Cổ Đô, Ba Vì, Hà Nội",
                "Đại lễ giỗ tổ toàn thể con cháu các chi ngành tề tựu dâng hương, báo công và trao khuyến học."
        ));
        eventRepository.save(new ClanEvent(
                treeId,
                null,
                "Đại Lễ Tảo Mộ Tiết Thanh Minh & Họp Mặt Xuân",
                "CLAN_MEETING",
                "03/03 Âm lịch",
                "Khu lăng mộ Tổ Gò Phượng Hoàng",
                "Tu bổ phần mộ tổ tiên, phát quang sơn sửa lăng tẩm và liên hoan gắn kết dòng họ đầu năm."
        ));
    }
}
