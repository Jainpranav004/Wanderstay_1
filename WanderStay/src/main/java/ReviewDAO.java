import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReviewDAO {
    private Connection connection;

    public ReviewDAO(Connection connection) {
        this.connection = connection;
    }

    public List<Review> getReviewsForListing(int listingId) throws SQLException {
        List<Review> reviews = new ArrayList<>();
        String query = "SELECT * FROM reviews WHERE listing_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            pstmt.setInt(1, listingId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reviews.add(new Review(
                            rs.getInt("id"),
                            rs.getInt("listing_id"),
                            rs.getString("username"),
                            rs.getString("content"),
                            rs.getInt("rating")));
                }
            }
        }
        return reviews;
    }

    public void addReview(Review review) throws SQLException {
        String query = "INSERT INTO reviews (listing_id, username, content, rating) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            pstmt.setInt(1, review.getListingId());
            pstmt.setString(2, review.getUsername());
            pstmt.setString(3, review.getContent());
            pstmt.setInt(4, review.getRating());
            pstmt.executeUpdate();
        }
    }
}
