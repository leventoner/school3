# Build stage
FROM rust:latest as builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Run stage
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/school3-backend /app/school3-backend
EXPOSE 8083
CMD ["./school3-backend"]
