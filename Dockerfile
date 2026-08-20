# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/ErpBackend.csproj", "backend/"]
RUN dotnet restore "backend/ErpBackend.csproj"
COPY backend/ backend/
WORKDIR "/src/backend"
RUN dotnet build "ErpBackend.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ErpBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ErpBackend.dll"]
